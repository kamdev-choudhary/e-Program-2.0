import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../hooks/AxiosInterceptor";
import { useGlobalContext } from "../../contexts/GlobalProvider";
import {
  Box,
  Paper,
  Typography,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

interface DoubtSolutions {
  postedBy: string;
  postedById?: string;
  solution: string;
  solutionPostedDate: string;
  upvotes: number;
  downvotes: number;
}

interface Doubt {
  _id: string;
  doubtQuestion: string;
  description: string;
  subject: string;
  tags: string[];
  postedBy: string;
  postedById?: string;
  status: string;
  upvotes: number;
  downvotes: number;
  doubtPostedDate: string;
  doubtSolutions: DoubtSolutions[];
}

const DoubtDetails: React.FC = () => {
  const { id } = useParams();
  const { isValidResponse } = useGlobalContext();
  const [doubt, setDoubt] = useState<Doubt | null>(null);

  const getDoubtDetails = async () => {
    try {
      const response = await axios.get(`/doubts/${id}`);
      if (isValidResponse(response)) {
        setDoubt(response.data.doubt);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getDoubtDetails();
  }, [id]);

  return (
    <Paper sx={{ padding: 3 }}>
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="h4" gutterBottom>
          Doubt Details
        </Typography>
      </Box>

      {doubt && (
        <>
          <Box sx={{ marginBottom: 2 }}>
            <Typography variant="h6">Question</Typography>
            <Typography variant="body1" paragraph>
              <div dangerouslySetInnerHTML={{ __html: doubt.doubtQuestion }} />
            </Typography>
          </Box>

          <Box sx={{ marginBottom: 2 }}>
            <Typography variant="h6">Description</Typography>
            <Typography variant="body1" paragraph>
              {doubt.description || "No description available."}
            </Typography>
          </Box>

          <Box sx={{ marginBottom: 2 }}>
            <Typography variant="h6">Subject</Typography>
            <Typography variant="body1">
              {doubt.subject || "No subject available"}
            </Typography>
          </Box>

          <Box sx={{ marginBottom: 2 }}>
            <Typography variant="h6">Tags</Typography>
            <Box>
              {doubt.tags.length > 0 ? (
                doubt.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    variant="outlined"
                    sx={{ marginRight: 0.5, marginBottom: 0.5 }}
                  />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No tags available
                </Typography>
              )}
            </Box>
          </Box>

          <Box sx={{ marginBottom: 2 }}>
            <Typography variant="h6">Posted By</Typography>
            <Typography variant="body1">{doubt.postedBy}</Typography>
          </Box>

          <Box sx={{ marginBottom: 2 }}>
            <Typography variant="h6">Status</Typography>
            <Typography variant="body1">{doubt.status}</Typography>
          </Box>

          <Box sx={{ marginBottom: 2 }}>
            <Typography variant="h6">Upvotes / Downvotes</Typography>
            <Typography variant="body1">
              {doubt.upvotes} Upvotes | {doubt.downvotes} Downvotes
            </Typography>
          </Box>

          <Box sx={{ marginBottom: 2 }}>
            <Typography variant="h6">Posted On</Typography>
            <Typography variant="body1">
              {new Date(doubt.doubtPostedDate).toLocaleDateString()}
            </Typography>
          </Box>

          <Divider sx={{ marginBottom: 2 }} />

          <Typography variant="h5" gutterBottom>
            Solutions
          </Typography>
          {doubt.doubtSolutions.length > 0 ? (
            <List>
              {doubt.doubtSolutions.map((solution, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={
                      <Typography variant="body1">
                        {solution.solution}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary">
                          Posted By: {solution.postedBy}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Upvotes: {solution.upvotes} | Downvotes:{" "}
                          {solution.downvotes}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Posted On:{" "}
                          {new Date(
                            solution.solutionPostedDate
                          ).toLocaleDateString()}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No solutions posted yet.
            </Typography>
          )}
        </>
      )}
    </Paper>
  );
};

export default DoubtDetails;
