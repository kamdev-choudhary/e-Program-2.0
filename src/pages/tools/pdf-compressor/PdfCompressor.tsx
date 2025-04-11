import React, { useState, useCallback } from "react";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
} from "@mui/material";
import FileDropZone from "../../../components/FileDropZone";
import { DownloadRounded, VisibilityRounded } from "@mui/icons-material";
import { useNotification } from "../../../contexts/NotificationProvider";
import axios from "../../../hooks/AxiosInterceptor";

const PDFCompressor: React.FC = () => {
  const { showNotification } = useNotification();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [compressedFiles, setCompressedFiles] = useState<
    { name: string; url: string }[]
  >([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [previewPdf, setPreviewPdf] = useState<string | null>(null);

  const handleFileChange = useCallback(
    (acceptedFiles: File[]) => {
      const pdfFiles = acceptedFiles.filter(
        (file) => file.type === "application/pdf"
      );
      if (pdfFiles.length === 0) {
        showNotification({
          message: "Please select valid PDF files.",
          type: "error",
        });
        return;
      }
      setSelectedFiles(pdfFiles);
      setCompressedFiles([]); // Reset previous compressed files
    },
    [showNotification]
  );

  const uploadAndCompressPDFs = async () => {
    if (selectedFiles.length === 0) {
      showNotification({
        message: "Please select PDF files.",
        type: "warning",
      });
      return;
    }

    setIsUploading(true);
    setProgress(0);
    setCompressedFiles([]);

    let completed = 0;

    for (const file of selectedFiles) {
      const formData = new FormData();
      formData.append("pdf", file);
      formData.append("maxSizeInKB", "300");

      try {
        const response = await axios.post("/tools/pdf/compress", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response.data && response.data.compressedFile) {
          // Ensure we store the correct file data
          setCompressedFiles((prev) => [
            ...prev,
            {
              name: file.name.replace(".pdf", "-compressed.pdf"),
              url: response.data.compressedFile,
            },
          ]);
        }
      } catch (error) {
        showNotification({
          message: `Failed to compress ${file.name}`,
          type: "error",
        });
      }

      completed++;
      setProgress((completed / selectedFiles.length) * 100);
    }

    setIsUploading(false);
  };

  const downloadAllAsZip = async () => {
    if (compressedFiles.length === 0) return;

    const zip = new JSZip();
    const filePromises = compressedFiles.map(async (file) => {
      const response = await fetch(file.url);
      const blob = await response.blob();
      zip.file(file.name, blob);
    });

    await Promise.all(filePromises);
    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "compressed_pdfs.zip");
  };

  const handleViewPDF = (url: string) => {
    setPreviewPdf(url);
  };

  return (
    <Box sx={{ p: 3, mx: "auto", textAlign: "center", maxWidth: 600 }}>
      <Typography variant="h4" gutterBottom>
        PDF Compressor Tool
      </Typography>

      <FileDropZone
        multiple
        acceptedExtensions={[".pdf"]}
        onDrop={handleFileChange}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={uploadAndCompressPDFs}
        disabled={selectedFiles.length === 0 || isUploading}
        sx={{ mt: 2 }}
      >
        {isUploading ? "Uploading & Compressing..." : "Upload & Compress PDFs"}
      </Button>

      {isUploading && (
        <LinearProgress variant="determinate" value={progress} sx={{ mt: 2 }} />
      )}

      {compressedFiles.length > 0 && (
        <>
          <Typography variant="h6" sx={{ mt: 3 }}>
            Compressed PDFs
          </Typography>
          <List>
            {compressedFiles.map((file, index) => (
              <ListItem key={index}>
                <ListItemText primary={file.name} />
                <IconButton onClick={() => handleViewPDF(file.url)}>
                  <VisibilityRounded />
                </IconButton>
                <IconButton
                  color="success"
                  onClick={() => saveAs(file.url, file.name)}
                >
                  <DownloadRounded />
                </IconButton>
              </ListItem>
            ))}
          </List>

          <Button
            variant="contained"
            color="secondary"
            onClick={downloadAllAsZip}
            sx={{ mt: 2 }}
          >
            Download All as ZIP
          </Button>
        </>
      )}

      <Dialog open={!!previewPdf} onClose={() => setPreviewPdf(null)}>
        {previewPdf && <iframe src={previewPdf} width="600" height="800" />}
      </Dialog>
    </Box>
  );
};

export default PDFCompressor;
