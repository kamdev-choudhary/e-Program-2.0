import React, { useState } from "react";
import { Document, Page } from "react-pdf";

interface FilePreview {
  name: string;
  type: string;
  size: number;
  url: string;
}

const FilePreviewer: React.FC = () => {
  const [files, setFiles] = useState<FilePreview[]>([]);
  const [error] = useState<string | null>(null);

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 border rounded-lg shadow-md max-w-2xl mx-auto bg-white">
      {/* Error Message */}
      {error && (
        <div className="mt-2 p-2 bg-red-100 text-red-600 border border-red-500 rounded">
          <strong>Error:</strong>
          <pre className="whitespace-pre-wrap">{error}</pre>
        </div>
      )}

      {/* File Previews */}
      {files.length > 0 && (
        <div className="space-y-4 mt-4">
          {files.map((file, index) => (
            <div key={index} className="border p-4 rounded-lg relative">
              <button
                onClick={() => removeFile(index)}
                className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
              >
                ✕
              </button>

              <p className="font-semibold">
                {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </p>

              {/* Image Preview */}
              {file.type.startsWith("image/") && (
                <img
                  src={file.url}
                  alt={file.name}
                  className="max-w-full h-auto mt-2 rounded-lg"
                />
              )}

              {/* PDF Preview with Thumbnail */}
              {file.type === "application/pdf" && (
                <div className="border mt-2 p-2 flex flex-col items-center">
                  <Document file={file.url}>
                    <Page pageNumber={1} width={150} />
                  </Document>
                  <a
                    href={file.url}
                    download
                    className="text-blue-600 underline mt-2"
                  >
                    Download PDF
                  </a>
                </div>
              )}

              {/* Text File Preview */}
              {file.type.startsWith("text/") && (
                <iframe
                  src={file.url}
                  title={file.name}
                  className="w-full h-40 border mt-2 rounded"
                ></iframe>
              )}

              {/* Video Preview */}
              {file.type.startsWith("video/") && (
                <video controls className="w-full mt-2 rounded-lg">
                  <source src={file.url} type={file.type} />
                  Your browser does not support the video tag.
                </video>
              )}

              {/* Audio Preview */}
              {file.type.startsWith("audio/") && (
                <audio controls className="mt-2">
                  <source src={file.url} type={file.type} />
                  Your browser does not support the audio element.
                </audio>
              )}

              {/* Generic File (Download Option) */}
              {!file.type.startsWith("image/") &&
                !file.type.startsWith("video/") &&
                !file.type.startsWith("audio/") &&
                !file.type.startsWith("text/") &&
                file.type !== "application/pdf" && (
                  <div className="mt-2">
                    <a
                      href={file.url}
                      download
                      className="text-blue-600 underline"
                    >
                      Download {file.name}
                    </a>
                  </div>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilePreviewer;
