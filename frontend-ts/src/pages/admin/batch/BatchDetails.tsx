import { Box, CircularProgress, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "../../../hooks/AxiosInterceptor";
import { useGlobalContext } from "../../../contexts/GlobalProvider";

interface BatchDetailsProps {
  batchId?: string;
}

interface BatchProp {
  title: string;
}

const BatchDetails: React.FC<BatchDetailsProps> = ({ batchId }) => {
  const { isValidResponse } = useGlobalContext();
  const [loading, setLoading] = useState<boolean>(true);
  const [batch, setBatch] = useState<BatchProp | null>(null);

  const getBatchDetails = async () => {
    try {
      const response = await axios.get("/batch/:id");
      if (isValidResponse(response)) {
        setBatch(response.data.batch);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!batchId) {
      return setLoading(false);
    }
    getBatchDetails();
  }, [batchId]);

  return (
    <Box>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          {batch ? (
            <Box></Box>
          ) : (
            <Box>
              <Typography>Batch not found.</Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default BatchDetails;
