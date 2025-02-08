import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ImageRun,
} from "docx";

// Your types
interface Option {
  optionText: string;
}

interface QuestionsProps {
  questionText: string;
  options: Option[];
}

/**
 * Utility to remove any HTML tags from a string.
 */
const stripHtml = (html: string): string => {
  return html.replace(/<[^>]+>/g, "");
};

/**
 * Helper function to load an image from an ArrayBuffer and retrieve its natural dimensions.
 *
 * @param buffer The image data as an ArrayBuffer.
 * @param fileType The image file type (e.g. "png", "jpeg").
 * @returns A Promise that resolves with the image's original width and height.
 */
function getImageDimensions(
  buffer: ArrayBuffer,
  fileType: string
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const uint8Array = new Uint8Array(buffer);
    const blob = new Blob([uint8Array], { type: `image/${fileType}` });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const dimensions = {
        width: img.naturalWidth,
        height: img.naturalHeight,
      };
      URL.revokeObjectURL(url);
      resolve(dimensions);
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };
    img.src = url;
  });
}

/**
 * Processes HTML content and returns an array of Paragraphs.
 *
 * If an <img> tag is found, the image is fetched and added as an ImageRun using
 * its original dimensions. Otherwise, text is stripped of HTML tags.
 *
 * @param html The HTML content to process.
 * @returns A Promise resolving to an array of Paragraph objects.
 */
async function processHtmlContent(html: string): Promise<Paragraph[]> {
  const paragraphs: Paragraph[] = [];
  // Regular expression to look for <img ... src="..." ...> tags (case–insensitive)
  const regex = /<img[^>]*src="([^"]+)"[^>]*>/gi;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(html)) !== null) {
    // Process any text before the image tag.
    const textBefore = html.substring(lastIndex, match.index);
    const strippedText = stripHtml(textBefore).trim();
    if (strippedText) {
      paragraphs.push(new Paragraph(strippedText));
    }
    lastIndex = regex.lastIndex;

    const imageUrl = match[1];
    try {
      const response = await fetch(imageUrl);
      if (response.ok) {
        const imageBuffer = await response.arrayBuffer();
        // Use the helper function to get the original image dimensions.
        const dimensions = await getImageDimensions(imageBuffer, "png");
        const imageRun = new ImageRun({
          data: new Uint8Array(imageBuffer), // Convert ArrayBuffer to Uint8Array
          transformation: {
            width: dimensions.width,
            height: dimensions.height,
          },
          type: "png", // Added to satisfy the type requirements.
        });
        paragraphs.push(new Paragraph({ children: [imageRun] }));
      } else {
        paragraphs.push(new Paragraph(`Image not found: ${imageUrl}`));
      }
    } catch (e) {
      paragraphs.push(new Paragraph(`Error loading image: ${imageUrl}`));
    }
  }

  // Process any remaining text after the last image.
  if (lastIndex < html.length) {
    const remainingText = html.substring(lastIndex);
    const strippedText = stripHtml(remainingText).trim();
    if (strippedText) {
      paragraphs.push(new Paragraph(strippedText));
    }
  }

  return paragraphs;
}

/**
 * Generates and downloads a Word document containing a table that mimics
 * the uploaded table format.
 *
 * The table layout:
 * - 5 columns in total.
 * - For each question:
 *   - A question row with:
 *     - Column 1: question number.
 *     - Column 2: question text spanning columns 2–5.
 *   - If options exist:
 *     - For exactly 4 options:
 *         • First, the function computes a one–row layout with 4 option cells.
 *         • However, if any computed option cell width is less than 25 (of the available 90),
 *           then a nested table (2×2) is used instead.
 *     - For other counts, a default one–row layout is used.
 *
 * @param questions Array of questions with their options.
 */
export async function downloadQuestionsAsWordInTableFormat(
  questions: QuestionsProps[]
) {
  // Array to hold all table rows for the main table.
  const tableRows: TableRow[] = [];
  // Define the minimum allowed width (as a percentage of the available option area)
  // for an option cell in the one–row layout.
  const MIN_OPTION_WIDTH = 25; // out of the available 90

  // Use a for–loop (instead of forEach) so we can await asynchronous processing.
  for (let qIndex = 0; qIndex < questions.length; qIndex++) {
    const question = questions[qIndex];

    // --- QUESTION ROW ---
    // Process the questionText so that any images or other components are included.
    const questionParagraphs = await processHtmlContent(question.questionText);

    const questionRow = new TableRow({
      children: [
        new TableCell({
          width: { size: 10, type: WidthType.PERCENTAGE },
          children: [new Paragraph(`${qIndex + 1}`)],
        }),
        new TableCell({
          columnSpan: 4,
          width: { size: 90, type: WidthType.PERCENTAGE },
          children: questionParagraphs,
        }),
      ],
    });
    tableRows.push(questionRow);

    // --- OPTION ROWS (if any) ---
    if (question.options && question.options.length > 0) {
      const options = question.options;
      const letters = ["(A)", "(B)", "(C)", "(D)"];

      if (options.length === 4) {
        // Compute the length (after stripping HTML) for each option.
        const lengths = options.map((opt) => stripHtml(opt.optionText).length);
        const totalTextLength = lengths.reduce((sum, len) => sum + len, 0);
        // Compute each option cell’s width (proportional to its text length)
        // out of the available 90%.
        const computedWidths = totalTextLength
          ? lengths.map((len) => (len / totalTextLength) * 90)
          : [90 / 4, 90 / 4, 90 / 4, 90 / 4];

        // Check if any computed width is less than the minimum.
        const useNestedLayout = computedWidths.some(
          (width) => width < MIN_OPTION_WIDTH
        );

        if (useNestedLayout) {
          // --- Use Nested Table Layout (2×2) ---
          const nestedRows: TableRow[] = [];
          // First row: options 0 and 1.
          const nestedRow1 = new TableRow({
            children: [
              new TableCell({
                width: { size: 50, type: WidthType.PERCENTAGE },
                children: await processHtmlContent(
                  `${letters[0]} ${options[0].optionText}`
                ),
              }),
              new TableCell({
                width: { size: 50, type: WidthType.PERCENTAGE },
                children: await processHtmlContent(
                  `${letters[1]} ${options[1].optionText}`
                ),
              }),
            ],
          });
          nestedRows.push(nestedRow1);
          // Second row: options 2 and 3.
          const nestedRow2 = new TableRow({
            children: [
              new TableCell({
                width: { size: 50, type: WidthType.PERCENTAGE },
                children: await processHtmlContent(
                  `${letters[2]} ${options[2].optionText}`
                ),
              }),
              new TableCell({
                width: { size: 50, type: WidthType.PERCENTAGE },
                children: await processHtmlContent(
                  `${letters[3]} ${options[3].optionText}`
                ),
              }),
            ],
          });
          nestedRows.push(nestedRow2);
          const nestedTable = new Table({
            rows: nestedRows,
            width: { size: 100, type: WidthType.PERCENTAGE },
          });
          // Add a row in the main table containing the nested table.
          const optionRow = new TableRow({
            children: [
              new TableCell({
                width: { size: 10, type: WidthType.PERCENTAGE },
                children: [new Paragraph("")],
              }),
              new TableCell({
                columnSpan: 4,
                width: { size: 90, type: WidthType.PERCENTAGE },
                children: [nestedTable],
              }),
            ],
          });
          tableRows.push(optionRow);
        } else {
          // --- Use Default 1×4 Layout ---
          const cells: TableCell[] = [];
          cells.push(
            new TableCell({
              width: { size: 10, type: WidthType.PERCENTAGE },
              children: [new Paragraph("")],
            })
          );
          // Create option cells with computed widths.
          for (let i = 0; i < 4; i++) {
            const optParagraphs = await processHtmlContent(
              `${letters[i]} ${options[i].optionText}`
            );
            cells.push(
              new TableCell({
                width: { size: computedWidths[i], type: WidthType.PERCENTAGE },
                children: optParagraphs,
              })
            );
          }
          tableRows.push(new TableRow({ children: cells }));
        }
      } else {
        // For option counts not equal to 4, use the default one–row layout.
        const lettersForOptions = options.map(
          (_, idx) => `(${String.fromCharCode(65 + idx)})`
        );
        const lengths = options.map((opt) => stripHtml(opt.optionText).length);
        const totalTextLength = lengths.reduce((sum, len) => sum + len, 0);
        const computedWidths =
          totalTextLength > 0
            ? lengths.map((len) => (len / totalTextLength) * 90)
            : Array(options.length).fill(90 / options.length);
        const cells: TableCell[] = [];
        // First cell: empty placeholder.
        cells.push(
          new TableCell({
            width: { size: 10, type: WidthType.PERCENTAGE },
            children: [new Paragraph("")],
          })
        );
        for (let i = 0; i < options.length; i++) {
          const optParagraphs = await processHtmlContent(
            `${lettersForOptions[i]} ${options[i].optionText}`
          );
          cells.push(
            new TableCell({
              width: { size: computedWidths[i], type: WidthType.PERCENTAGE },
              children: optParagraphs,
            })
          );
        }
        // Add empty cells to ensure a total of 5 cells.
        while (cells.length < 5) {
          cells.push(
            new TableCell({
              children: [new Paragraph("")],
            })
          );
        }
        tableRows.push(new TableRow({ children: cells }));
      }
    }
  }

  // Create a table with 100% width.
  const table = new Table({
    rows: tableRows,
    width: { size: 100, type: WidthType.PERCENTAGE },
  });

  // Create the document with a single section containing the table.
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [table],
      },
    ],
  });

  // Generate the document as a Blob and trigger a download.
  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "shuffled-questions.docx";
  anchor.click();
  URL.revokeObjectURL(url);
}
