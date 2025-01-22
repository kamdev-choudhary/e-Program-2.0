import React from "react";
import { useDropzone } from "react-dropzone";
import { CloudUploadRounded } from "@mui/icons-material";
import { Typography, Box } from "@mui/material";
import useTheme from "../utils/useTheme";

interface FileDropZoneProps {
  onDrop: (files: File[]) => void;
  title?: string;
  acceptedExtensions?: string[]; // Array of file extensions (e.g., [".xlsx", ".xls"])
  multiple?: boolean;
}

const FileDropZone: React.FC<FileDropZoneProps> = ({
  onDrop,
  title = "Drag & drop files here, or click to select files",
  acceptedExtensions = [], // Default to empty array for no restrictions
  multiple = false, // Allow multiple files by default
}) => {
  const { theme } = useTheme();
  // Convert the array of extensions to the accept object
  const getAcceptObject = (extensions: string[]) => {
    const mimeTypes: { [key: string]: string[] } = {};

    extensions.forEach((ext) => {
      if (ext === ".xlsx") {
        mimeTypes[
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ] = [
          ...(mimeTypes[
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          ] || []),
          ext,
        ];
      } else if (ext === ".xls") {
        mimeTypes["application/vnd.ms-excel"] = [
          ...(mimeTypes["application/vnd.ms-excel"] || []),
          ext,
        ];
      } else if (ext === ".pdf") {
        mimeTypes["application/pdf"] = [
          ...(mimeTypes["application/pdf"] || []),
          ext,
        ];
      } else if (
        ext.startsWith(".png") ||
        ext.startsWith(".jpg") ||
        ext.startsWith(".jpeg")
      ) {
        mimeTypes["image/*"] = [...(mimeTypes["image/*"] || []), ext];
      }
      // Add more MIME types and extensions as needed
    });

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
          theme === "dark" ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)"
        }`,
        borderRadius: 4,
        cursor: "pointer",
        flexGrow: 1,
        alignContent: "center",
        p: 1.1,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <input {...getInputProps()} />
      <CloudUploadRounded sx={{ mr: 1 }} />
      <Typography variant="body1">{title}</Typography>
    </Box>
  );
};

export default FileDropZone;
