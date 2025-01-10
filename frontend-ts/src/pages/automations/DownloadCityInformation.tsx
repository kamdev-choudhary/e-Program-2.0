import { Box, Paper, Button } from "@mui/material";
import React from "react";
import axios from "../../hooks/AxiosInterceptor"; // Assuming this is your custom Axios instance
import saveAs from "file-saver";

const DownloadCityInformation: React.FC = () => {
  const handleDownloadCityInfo = async () => {
    try {
      // Make the request to get the PDF file path (ensure the response is a blob)
      const response = await axios.post("/automation/jee");
      const response2 = await fetch(response.data.pdfUrl);

      if (response2.ok) {
        // Convert the response2 to a blob
        const blob = await response2.blob();

        // Use FileSaver's saveAs function to download the PDF
        saveAs(blob, "downloaded-file.pdf");
      }
    } catch (error) {
      console.error("Error downloading the PDF:", error);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Paper>
        <Box>
          <Button onClick={handleDownloadCityInfo}>Download</Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default DownloadCityInformation;
