import React from "react";
import { useDropzone } from "react-dropzone";
import { CloudUploadRounded } from "@mui/icons-material";
import { Typography, Box } from "@mui/material";
import useTheme from "../utils/useTheme";

interface FileDropZoneProps {
  onDrop: (files: File[]) => void;
  title?: string;
  acceptedExtensions?: string[]; // Array of file extensions (e.g., [".xlsx", ".xls", ".docx"])
  multiple?: boolean;
}

const FileDropZone: React.FC<FileDropZoneProps> = ({
  onDrop,
  title = "Drag & drop files here, or click to select files",
  acceptedExtensions = [],
  multiple = false,
}) => {
  const { theme } = useTheme();

  // Convert the array of extensions to the accept object
  const getAcceptObject = (extensions: string[]) => {
    const mimeTypes: { [key: string]: string[] } = {};

    if (extensions.length === 0) {
      mimeTypes["*/*"] = [];
    } else {
      extensions.forEach((ext) => {
        switch (ext) {
          case ".xlsx":
            mimeTypes[
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            ] = [
              ...(mimeTypes[
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              ] || []),
              ext,
            ];
            break;
          case ".xls":
            mimeTypes["application/vnd.ms-excel"] = [
              ...(mimeTypes["application/vnd.ms-excel"] || []),
              ext,
            ];
            break;
          case ".pdf":
            mimeTypes["application/pdf"] = [
              ...(mimeTypes["application/pdf"] || []),
              ext,
            ];
            break;
          case ".doc":
            mimeTypes["application/msword"] = [
              ...(mimeTypes["application/msword"] || []),
              ext,
            ];
            break;
          case ".docx":
            mimeTypes[
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            ] = [
              ...(mimeTypes[
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              ] || []),
              ext,
            ];
            break;
          case ".png":
          case ".jpg":
          case ".jpeg":
            mimeTypes["image/*"] = [...(mimeTypes["image/*"] || []), ext];
            break;
          case "all":
            mimeTypes["*/*"] = []; // Accept all files when "all" is included
            break;
          default:
            mimeTypes["*/*"] = [...(mimeTypes["*/*"] || []), ext]; // Catch-all for unknown extensions
        }
      });
    }

    return mimeTypes;
  };

  const accept = getAcceptObject(acceptedExtensions);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept,
    multiple,
  });

  return (
    <Box
      {...getRootProps()}
      sx={{
        border: `1px dashed ${
          theme === "dark" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.15)"
        }`,
        borderRadius: 20,
        cursor: "pointer",
        flexGrow: 1,
        // Use modern, subtle shadows
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 1.1,
        transition: "all 0.3s ease",
        "&:hover": {
          // On hover, elevate the shadow and change the border to a solid accent
          boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.16)",
          border: `0.5px solid ${
            theme === "dark"
              ? "rgba(255,255,255,0.85)"
              : "rgba(115, 203, 227, 0.65)"
          }`,
        },
      }}
    >
      <input {...getInputProps()} />
      <CloudUploadRounded sx={{ mr: 1 }} />
      <Typography variant="body1">{title}</Typography>
    </Box>
  );
};

export default FileDropZone;
