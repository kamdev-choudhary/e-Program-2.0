import html2canvas from "html2canvas";

/**
 * Captures an HTML element and saves it as a PNG image with padding.
 * @param elementId The ID of the HTML element to capture.
 * @param filename The name of the downloaded PNG file.
 * @param padding The amount of padding (in pixels).
 */

export const captureElementAsPNG = async (
  elementId: string,
  filename: string = "captured-image.png",
  padding: number = 8 // Default padding of 20px
) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with ID '${elementId}' not found.`);
    return;
  }

  try {
    // Create a wrapper div with padding
    const wrapper = document.createElement("div");
    wrapper.style.padding = `${padding}px`;
    wrapper.style.backgroundColor = "transparent"; // Ensure the padding area is visible
    wrapper.style.display = "inline-block";

    // Clone the target element and append it to the wrapper
    const clonedElement = element.cloneNode(true) as HTMLElement;
    wrapper.appendChild(clonedElement);

    // Append the wrapper to the body (temporarily)
    document.body.appendChild(wrapper);

    // Capture the wrapped element
    const canvas = await html2canvas(wrapper);

    // Remove the temporary wrapper
    document.body.removeChild(wrapper);

    // Convert to image and trigger download
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error capturing element:", error);
  }
};
