import { AddRounded, SearchRounded } from "@mui/icons-material";
import {
  Box,
  Button,
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
import axios from "axios";
import { CustomModal } from "../../components/CustomModal";
import { useGlobalContext } from "../../contexts/GlobalProvider";
import NewDoubt from "./NewDoubt";

const Doubts: React.FC = () => {
  const { user } = useGlobalContext();
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
          <Tab label="Your Doubts" />
        </Tabs>
      </Box>
      <Box sx={{ p: 2 }}>
        {doubts && doubts.length > 0 ? (
          doubts.map((doubt) => (
            <Box key={doubt._id} sx={{ mb: 2 }}>
              <Typography variant="h6">{doubt.doubtQuestion}</Typography>
              <Typography variant="body2" color="textSecondary">
                {doubt.subject} |{" "}
                {new Date(doubt.doubtPostedDate).toLocaleDateString()}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {doubt.description}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2">
                Solutions: {doubt.doubtSolutions.length}
              </Typography>
            </Box>
          ))
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
