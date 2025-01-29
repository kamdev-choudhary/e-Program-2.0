import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Typography,
  Paper,
  CardMedia,
  Tabs,
  Tab,
} from "@mui/material";
import { Book, VideoLibrary } from "@mui/icons-material";
import moment from "moment";
import axios from "../../hooks/AxiosInterceptor";

interface BatchDetails {
  books: [];
  class: string;
  createdAt: string;
  lectures: [];
  name: string;
  status: number;
  templateImage: {
    title: string;
    url: string;
  };
  testTemplates: [];
  description: string;
}

const BatchDetails: React.FC = () => {
  const { id } = useParams();
  const [batchDetails, setBatchDetails] = useState<BatchDetails | null>(null);
  const [activeTab, setActiveTab] = useState<number>(0);

  const getBatchDetails = async () => {
    try {
      const response = await axios.get(`/batch/${id}`);
      setBatchDetails(response.data.batch);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!id) return;
    getBatchDetails();
  }, [id]);

  if (!batchDetails) {
    return (
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6" align="center">
          Loading batch details...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Card elevation={3} sx={{ borderRadius: 2 }}>
        {batchDetails?.templateImage.url && (
          <CardMedia
            component="img"
            height="350"
            src={batchDetails.templateImage.url}
            alt={batchDetails.templateImage.title}
          />
        )}
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" gutterBottom>
              <strong>{batchDetails?.name}</strong>
            </Typography>
            <Typography variant="body2">
              <strong>Created At:</strong>{" "}
              {moment(batchDetails?.createdAt).format("DD-MM-YYYY")}
            </Typography>
          </Box>
        </CardContent>
        <Divider />
        <CardContent>
          <Typography variant="body1">
            <strong>Class:</strong> {batchDetails?.class}
          </Typography>
        </CardContent>
        <Divider />
        <CardContent>
          {/* Details */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {batchDetails?.description || "No description available."}
            </Typography>
          </Box>
        </CardContent>
        <Divider />
        <CardContent>
          <Box>
            <Tabs
              value={activeTab}
              onChange={(_: React.SyntheticEvent, value: number) =>
                setActiveTab(value)
              }
            >
              <Tab label="Planner" />
              <Tab label="Lectures" />
              <Tab label="Books" />
            </Tabs>
          </Box>
        </CardContent>
        {activeTab === 2 && batchDetails?.books.length > 0 ? (
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <Book sx={{ marginRight: 1 }} />
              Books
            </Typography>
            <Paper
              elevation={1}
              sx={{
                padding: 2,
                backgroundColor: "#f5f5f5",
                borderRadius: 2,
              }}
            >
              {batchDetails?.books.map((book, index) => (
                <Typography key={index} variant="body2" color="textSecondary">
                  {book}
                </Typography>
              ))}
            </Paper>
          </CardContent>
        ) : (
          <CardContent>
            <Typography>No Content Available</Typography>
          </CardContent>
        )}
        {activeTab === 1 && batchDetails?.lectures.length > 0 && (
          <Card elevation={3} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <VideoLibrary sx={{ marginRight: 1 }} />
                Lectures
              </Typography>
              <Paper
                elevation={1}
                sx={{
                  padding: 2,
                  backgroundColor: "#f5f5f5",
                  borderRadius: 2,
                }}
              >
                {batchDetails?.lectures.map((lecture, index) => (
                  <Typography key={index} variant="body2" color="textSecondary">
                    {lecture}
                  </Typography>
                ))}
              </Paper>
            </CardContent>
          </Card>
        )}
      </Card>
    </Box>
  );
};

export default BatchDetails;
