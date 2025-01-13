import { AddRounded, SearchRounded } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Divider,
  InputAdornment,
  OutlinedInput,
  Pagination,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "../../hooks/AxiosInterceptor";
import { CustomModal } from "../../components/CustomModal";
import { useGlobalContext } from "../../contexts/GlobalProvider";
import NewDoubt from "./NewDoubt";
import { useNavigate } from "react-router-dom";

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

const DoubtCard: React.FC<{ doubt: Doubt }> = ({ doubt }) => {
  const navigate = useNavigate();
  return (
    <Card
      sx={{
        margin: 2,
        padding: 2,
        boxShadow: 4,
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Typography variant="body1">
            <strong>Posted By:</strong> {doubt.postedBy || "Anonymous"}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Posted On:</strong>{" "}
            {doubt.doubtPostedDate
              ? new Date(doubt.doubtPostedDate).toLocaleDateString()
              : "Unknown"}
          </Typography>
        </Box>
        <Divider sx={{ marginY: 2 }} />

        <Typography variant="h5" component="div" gutterBottom>
          {doubt.doubtQuestion}
        </Typography>

        <Typography variant="body1" gutterBottom>
          <strong>Description:</strong> {doubt.description || "N/A"}
        </Typography>

        <Typography variant="body1" color="text.secondary" gutterBottom>
          <strong>Subject:</strong> {doubt.subject || "N/A"}
        </Typography>

        <Box sx={{ marginBottom: 2 }}>
          <strong>Tags:</strong>{" "}
          {doubt.tags.length > 0 ? (
            doubt.tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                variant="outlined"
                size="small"
                sx={{ marginRight: 0.5 }}
              />
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No tags available
            </Typography>
          )}
        </Box>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          <strong>Status:</strong> {doubt.status || "Unknown"}
        </Typography>

        <Typography variant="body2" gutterBottom>
          <strong>Upvotes:</strong> {doubt.upvotes} |{" "}
          <strong>Downvotes:</strong> {doubt.downvotes}
        </Typography>
      </CardContent>
      <Divider />
      <CardActions
        sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 1 }}
      >
        <Button variant="contained">Post a solution</Button>
        <Button variant="contained" onClick={() => navigate(`${doubt._id}`)}>
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

const Doubts: React.FC = () => {
  const { isLoggedIn } = useGlobalContext();
  const [searchText, setSearchText] = useState<string>("");
  const [showNewDoubtModal, setShowNewDoubtModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [doubts, setDoubts] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Fetch doubts based on active tab
  const fetchDoubtData = async () => {
    try {
      let filter = "unsolved"; // Default filter
      if (activeTab === 1) filter = "solved";
      if (activeTab === 2) filter = "user";

      const response = await axios.post("/doubts/pagination", {
        page: currentPage,
        status: filter,
        limit: 10,
      });

      setDoubts(response.data.doubts);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching doubts:", error);
    }
  };

  // Trigger fetch on tab change, search, or page change
  useEffect(() => {
    fetchDoubtData();
  }, [activeTab, searchText, currentPage]);

  return (
    <Paper>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Typography variant="h5" sx={{ p: 1, fontWeight: "bold" }}>
          Ask a Doubt
        </Typography>
      </Box>
      <Divider />
      <Box
        sx={{
          mt: 2,
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          justifyContent: "space-between",
          px: 2,
        }}
      >
        <OutlinedInput
          value={searchText}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchText(e.target.value)
          }
          placeholder="Search for a doubt"
          startAdornment={
            <InputAdornment position="start">
              <SearchRounded />
            </InputAdornment>
          }
          sx={{ flexGrow: 1 }}
        />
        <Button
          onClick={() => setShowNewDoubtModal(true)}
          startIcon={<AddRounded />}
        >
          Post a new Doubt
        </Button>
      </Box>
      <Box sx={{ my: 1 }}>
        <Tabs
          value={activeTab}
          onChange={(_: React.SyntheticEvent, value: number) =>
            setActiveTab(value)
          }
        >
          <Tab label="Unsolved Doubts" />
          <Tab label="Solved Doubts" />
          {isLoggedIn && <Tab label="Your Doubts" />}
        </Tabs>
      </Box>
      <Box>
        {doubts && doubts.length > 0 ? (
          doubts.map((doubt) => <DoubtCard doubt={doubt} />)
        ) : (
          <Typography>No doubts found</Typography>
        )}
      </Box>
      <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(_, value) => setCurrentPage(value)}
        />
      </Box>
      <CustomModal
        open={showNewDoubtModal}
        onClose={() => setShowNewDoubtModal(false)}
      >
        <NewDoubt setShowNewDoubtModal={setShowNewDoubtModal} />
      </CustomModal>
    </Paper>
  );
};

export default Doubts;
