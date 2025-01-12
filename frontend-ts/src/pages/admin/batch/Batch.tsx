import { AddRounded } from "@mui/icons-material";
import {
  Paper,
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
        name: "Batch 1",
        class: "Class A",
        image:
          "data:image/jpeg;base64,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",
        price: "Free",
      },
      {
        name: "Batch 2",
        class: "Class B",
        image:
          "data:image/jpeg;base64,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",
        price: "Free",
      },
    ]);
  }, []);

  return (
    <Paper sx={{ padding: 2 }}>
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
            <Grid size={{ xs: 12, sm: 6, md: 3, lg: 2 }} key={index}>
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
                  <Button sx={{ flex: 1 }} variant="contained">
                    Join
                  </Button>
                  <Button
                    onClick={() => navigate(`/batch/sdfdskjhkjhdk`)}
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
    </Paper>
  );
};

export default Batch;
