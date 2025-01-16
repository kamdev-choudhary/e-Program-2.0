import { AddRounded } from "@mui/icons-material";
import {
  Box,
  Typography,
  Divider,
  Card,
  CardMedia,
  CardContent,
  Grid2 as Grid,
  CardActions,
  Button,
  Paper,
  CircularProgress,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { CustomModal } from "../../../components/CustomModal";
import AddBatch from "./AddBatch";
import EditBatch from "./EditBatch";
import BatchDetails from "./BatchDetails";
import axios from "../../../hooks/AxiosInterceptor";
import { useGlobalContext } from "../../../contexts/GlobalProvider";

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
  const { isValidResponse } = useGlobalContext();
  const [batches, setBatches] = useState<Batch[] | null>(null);
  const [addBatchModal, setAddBatchModal] = useState<boolean>(false);
  const [showBatchDetails, setShowBatchDetails] = useState<boolean>(false);
  const [showEditBatch, setShowEditBatch] = useState<boolean>(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getBatches = async () => {
    try {
      const response = await axios.get("/batch");
      if (isValidResponse(response)) {
        setBatches(response.data.batches);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getBatches();
  }, []);

  return (
    <Box sx={{ padding: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 2,
          position: "relative",
        }}
      >
        <Typography variant="h5" component="h1">
          Manage Batches
        </Typography>
        <Button
          onClick={() => setAddBatchModal(true)}
          sx={{ position: "absolute", right: 4 }}
          startIcon={<AddRounded />}
          variant="contained"
          color="success"
        >
          Add Batch
        </Button>
      </Box>
      <Divider sx={{ mb: 2 }} />
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <CircularProgress />
        </Box>
      ) : batches ? (
        <Grid container spacing={2}>
          {batches.map((batch, index) => (
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
      >
        <Paper>
          <AddBatch setAddBatchModal={setAddBatchModal} />
        </Paper>
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
