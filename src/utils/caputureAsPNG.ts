import html2canvas from "html2canvas";

/**
 * Captures an HTML element and saves it as a PNG image with padding.
 * @param elementId The ID of the HTML element to capture.
 * @param filename The name of the downloaded PNG file.
 * @param padding The amount of padding (in pixels).
 */

export const captureElementAsPNG = async ({
  elementId,
  filename = "captured-image.png",
  padding = 8,
  hiddenSelectors = [],
  download = true,
}: {
  elementId: string;
  filename?: string;
  padding?: number;
  hiddenSelectors?: string[];
  download?: boolean;
}) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with ID '${elementId}' not found.`);
    return;
  }

  try {
    // Clone the target element
    const clonedElement = element.cloneNode(true) as HTMLElement;

    // Hide specified elements inside the cloned element
    hiddenSelectors.forEach((selector) => {
      const elementsToHide = clonedElement.querySelectorAll(selector);
      elementsToHide.forEach((el) => {
        (el as HTMLElement).style.display = "none";
      });
    });

    // Create a wrapper div with padding
    const wrapper = document.createElement("div");
    wrapper.style.padding = `${padding}px`;
    wrapper.style.backgroundColor = "transparent";
    wrapper.style.display = "inline-block";
    wrapper.appendChild(clonedElement);

    // Append the wrapper to the body (temporarily)
    document.body.appendChild(wrapper);

    // Capture the wrapped element
    const canvas = await html2canvas(wrapper);

    // Remove the temporary wrapper
    document.body.removeChild(wrapper);

    // 📌 Copy to clipboard
    if (navigator.clipboard) {
      canvas.toBlob((blob) => {
        if (blob) {
          const item = new ClipboardItem({ "image/png": blob });
          navigator.clipboard.write([item]);
        }
      });
    } else {
      console.warn("Clipboard API not supported.");
    }

    // Convert to image and trigger download
    if (download) {
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (error) {
    console.error("Error capturing element:", error);
  }
};
