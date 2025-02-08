import React, { useState } from "react";
import { Box, Button, Card, CardContent, Divider, Paper } from "@mui/material";
import FileDropZone from "../../components/FileDropZone";
import mammoth from "mammoth";
import { DownloadRounded, ShuffleRounded } from "@mui/icons-material";
import { downloadQuestionsAsWordInTableFormat } from "./functions";

interface Option {
  optionText: string;
}

interface QuestionsProps {
  questionNumber: string | number;
  questionText: string;
  options: Option[];
}

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function shuffleQuestionsAndOptions(
  questions: QuestionsProps[]
): QuestionsProps[] {
  return shuffleArray(questions).map((question) => ({
    ...question,
    options: shuffleArray(question.options),
  }));
}

function isQuestionRow(row: HTMLTableRowElement): boolean {
  const firstCell = row.querySelector("td");
  if (!firstCell) return false;
  const text = firstCell.textContent?.trim() || "";
  return text !== "" && !isNaN(parseInt(text));
}

function extractOptionsFromOptionRow(row: HTMLTableRowElement): Option[] {
  const options: Option[] = [];
  const cells = Array.from(row.querySelectorAll("td"));
  let nestedFound = false;

  // Look for nested table options first.
  for (const cell of cells) {
    const innerTable = cell.querySelector("table");
    if (innerTable) {
      nestedFound = true;
      const innerCells = Array.from(innerTable.querySelectorAll("td"));
      innerCells.forEach((innerCell) => {
        let text = innerCell.textContent?.trim();
        if (text) {
          options.push({ optionText: text });
        }
      });
    }
  }
  if (nestedFound) {
    return options;
  }

  // No nested table: decide whether to skip the first cell.
  if (cells.length > 1 && cells[0].textContent?.trim() === "") {
    for (let i = 1; i < cells.length; i++) {
      let text = cells[i].textContent?.trim();
      text = text?.replace(/^\(\s*(A|B|C|D|1|2|3|4)\s*\)/, "");
      if (text) {
        options.push({ optionText: text });
      }
    }
  } else {
    cells.forEach((cell) => {
      const text = cell.textContent?.trim();
      if (text) {
        options.push({ optionText: text });
      }
    });
  }

  return options;
}

const SuffleQuestionInWord: React.FC = () => {
  const [questions, setQuestions] = useState<QuestionsProps[] | null>(null);
  const onDrop = async (files: File[]) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    try {
      // Read file as ArrayBuffer and convert to HTML.
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      const html = result.value;

      // Parse the HTML string.
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const table = doc.querySelector("table");
      if (!table) {
        console.error("No table found in the document.");
        return;
      }

      const rows = Array.from(table.querySelectorAll("tr"));
      const questionsArr: QuestionsProps[] = [];
      let i = 0;

      while (i < rows.length) {
        const row = rows[i];

        // Detect a question row by its first cell containing a number.
        if (isQuestionRow(row)) {
          const cells = Array.from(row.querySelectorAll("td"));
          // Assume the second cell contains the question text.
          const questionNumber = cells.length >= 2 ? cells[0].innerText : i + 1;
          const questionText = cells.length >= 2 ? cells[1].innerHTML : "";
          const options: Option[] = [];
          let j = i + 1;

          // All following rows until the next question row are considered option rows.
          while (j < rows.length && !isQuestionRow(rows[j])) {
            const optionRow = rows[j];
            const rowOptions = extractOptionsFromOptionRow(optionRow);
            // Add only non-empty options.
            if (rowOptions.length > 0) {
              options.push(...rowOptions);
            }
            j++;
          }

          questionsArr.push({
            questionNumber,
            questionText,
            options,
          });

          i = j; // Skip over processed option rows.
        } else {
          i++;
        }
      }

      setQuestions(questionsArr);
    } catch (error) {
      console.error("Error processing the file:", error);
    }
  };

  // Shuffle the questions and options when the button is clicked.
  const handleShuffle = () => {
    if (questions) {
      const shuffled = shuffleQuestionsAndOptions(questions);
      setQuestions(shuffled);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Paper
        sx={{ padding: 2, display: "flex", gap: 2, flex: 1, flexWrap: "wrap" }}
      >
        <Box sx={{ display: "flex", flexGrow: 1 }}>
          <FileDropZone acceptedExtensions={[".docx"]} onDrop={onDrop} />
        </Box>
        <Button
          startIcon={<ShuffleRounded />}
          variant="contained"
          onClick={handleShuffle}
          disabled={!questions || questions?.length === 0}
        >
          Suffle Questions and Options
        </Button>
        <Button
          variant="contained"
          color="success"
          startIcon={<DownloadRounded />}
          onClick={() => {
            if (questions && questions?.length > 0) {
              downloadQuestionsAsWordInTableFormat(questions);
            }
          }}
          disabled={!questions || questions?.length === 0}
        >
          Download as Word
        </Button>
      </Paper>
      <Paper sx={{ padding: 2 }}>
        {questions &&
          questions.map((question, index) => (
            <Card key={index} sx={{ mb: 1 }}>
              <CardContent>
                <div
                  dangerouslySetInnerHTML={{ __html: question.questionText }}
                />
              </CardContent>
              <Divider />
              <CardContent>
                {question.options.map((option, idx) => (
                  <Box key={idx}>
                    <div
                      dangerouslySetInnerHTML={{ __html: option.optionText }}
                    />
                  </Box>
                ))}
              </CardContent>
            </Card>
          ))}
      </Paper>
    </Box>
  );
};

export default SuffleQuestionInWord;
