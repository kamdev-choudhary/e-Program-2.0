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
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { CustomModal } from "../../../components/CustomModal";
import AddBatch from "./AddBatch";
import { useNavigate } from "react-router-dom";

interface Batch {
  _id: string;
  name: string;
  class: string;
  image: string;
  price: string;
}

const Batch: React.FC = () => {
  const navigate = useNavigate();
  const [batches, setBatches] = useState<Batch[] | null>(null);
  const [addBatchModal, setAddBatchModal] = useState<boolean>(false);

  useEffect(() => {
    // Mock data for batches
    setBatches([
      {
        _id: "efd8de48Dd78878ddwdw",
        name: "Batch 1",
        class: "Class A",
        image:
          "https://track2training.com/wp-content/uploads/2022/03/featured-importance-education.png",
        price: "Free",
      },
      {
        _id: "dewd7ed7adadae7",
        name: "Batch 2",
        class: "Class B",
        image:
          "https://www.billabonghighschool.com/wp-content/uploads/2024/02/ICSE-Board-.jpg",
        price: "Free",
      },
    ]);
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
      {batches ? (
        <Grid container spacing={2}>
          {batches.map((batch, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={batch.image}
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
                <CardActions sx={{ display: "flex" }}>
                  <Button
                    onClick={() => navigate(`/batch/${batch._id}`)}
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
        width="auto"
        height="auto"
        open={addBatchModal}
        onClose={() => setAddBatchModal(false)}
      >
        <AddBatch setAddBatchModal={setAddBatchModal} />
      </CustomModal>
    </Box>
  );
};

export default Batch;
