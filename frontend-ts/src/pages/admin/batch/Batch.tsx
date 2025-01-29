import { AddRounded, SearchRounded } from "@mui/icons-material";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Grid2 as Grid,
  CardActions,
  Button,
  CircularProgress,
  OutlinedInput,
  InputAdornment,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { CustomModal } from "../../../components/CustomModal";
import AddBatch from "./AddBatch";
import EditBatch from "./EditBatch";
import BatchDetails from "./BatchDetails";
import axios from "../../../hooks/AxiosInterceptor";

interface Image {
  url: string;
  title: string;
}

interface Batch {
  _id: string;
  name: string;
  class: string;
  image: string;
  price: string;
  templateImage: Image;
}

const Batch: React.FC = () => {
  const [batches, setBatches] = useState<Batch[] | null>(null);
  const [addBatchModal, setAddBatchModal] = useState<boolean>(false);
  const [showBatchDetails, setShowBatchDetails] = useState<boolean>(false);
  const [showEditBatch, setShowEditBatch] = useState<boolean>(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");

  const getBatches = async () => {
    try {
      const response = await axios.get("/batch");
      setBatches(response.data.batches);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getBatches();
  }, []);

  const filteredBatches = useMemo(() => {
    if (!batches) return []; // Return an empty array if batches is undefined or null
    const trimmedSearchText = searchText.toLowerCase().trim();
    return batches.filter((batch) => {
      return Object.values(batch).some((value) =>
        String(value).toLowerCase().includes(trimmedSearchText)
      );
    });
  }, [searchText, batches]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box sx={{ display: "flex", width: "100%", gap: 2 }}>
        <OutlinedInput
          placeholder="Search batches"
          sx={{ flexGrow: 1 }}
          startAdornment={
            <InputAdornment position="start">
              <SearchRounded />
            </InputAdornment>
          }
          value={searchText}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchText(e.target.value)
          }
        />
        <Button
          onClick={() => setAddBatchModal(true)}
          startIcon={<AddRounded />}
          variant="contained"
          color="success"
          sx={{ minWidth: 150 }}
        >
          Add Batch
        </Button>
      </Box>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <CircularProgress />
        </Box>
      ) : filteredBatches.length > 0 ? (
        <Grid container spacing={2}>
          {filteredBatches.map((batch, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={batch.templateImage.url}
                  alt={batch.name}
                  sx={{ borderRadius: 2 }}
                />
                <CardContent>
                  <Typography variant="h6">{batch.name}</Typography>
                  <Typography variant="body1" color="text.secondary">
                    Class: {batch.class}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Price: {batch.price}
                  </Typography>
                </CardContent>
                <CardActions sx={{ display: "flex", gap: 1, flexGrow: 1 }}>
                  <Button
                    color="secondary"
                    variant="contained"
                    sx={{ flex: 1 }}
                    onClick={() => {
                      setSelectedBatch(batch);
                      setShowEditBatch(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedBatch(batch);
                      setShowBatchDetails(true);
                    }}
                    sx={{ flex: 1 }}
                    variant="contained"
                  >
                    Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" color="text.secondary">
          No batches available.
        </Typography>
      )}

      {/* Add Batch Modal */}
      <CustomModal
        open={addBatchModal}
        onClose={() => setAddBatchModal(false)}
        height="auto"
        header="Add New Batch"
        width="auto"
      >
        <AddBatch setAddBatchModal={setAddBatchModal} />
      </CustomModal>

      {/* Edit Batch */}

      <CustomModal
        open={showEditBatch}
        onClose={() => setShowEditBatch(false)}
        header="Edit Batch"
        height="95svh"
      >
        <EditBatch />
      </CustomModal>

      {/* Batch Details */}
      <CustomModal
        open={showBatchDetails}
        onClose={() => setShowBatchDetails(false)}
        header="Batch Details"
        height="95svh"
      >
        <BatchDetails batchId={selectedBatch?._id} />
      </CustomModal>
    </Box>
  );
};

export default Batch;
