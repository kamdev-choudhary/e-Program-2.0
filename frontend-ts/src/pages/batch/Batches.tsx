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
  TextField,
} from "@mui/material";
import React, { useEffect, useState, useMemo } from "react";
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
  const [searchText, setSearchText] = useState<string>("");

  const filteredBatches = useMemo(() => {
    if (!batches) return []; // Return an empty array if batches is undefined or null
    const trimmedSearchText = searchText.toLowerCase().trim();
    return batches.filter((batch) => {
      return Object.values(batch).some((value) =>
        String(value).toLowerCase().includes(trimmedSearchText)
      );
    });
  }, [searchText, batches]);

  useEffect(() => {
    // Mock data for batches
    setBatches([
      {
        name: "Batch 1",
        class: "Class A",
        image:
          "https://img.freepik.com/free-photo/books-with-graduation-cap-digital-art-style-education-day_23-2151164325.jpg",
        price: "Free",
      },
      {
        name: "Batch 2",
        class: "Class B",
        image:
          "https://images.shiksha.com/mediadata/shikshaOnline/mailers/2021/naukri-learning/oct/27oct-v3/education.jpg",
        price: "Free",
      },
    ]);
  }, []);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5" component="h1">
          Manage Batches
        </Typography>
      </Box>
      <Divider sx={{ mb: 2, border: "1px solid rgba(0,0,0,03" }} />
      <Box sx={{ mb: 2 }}>
        <TextField
          size="small"
          value={searchText}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchText(e.target.value)
          }
          label="Search"
          fullWidth
          sx={{ borderRadius: 10 }}
        />
      </Box>
      {filteredBatches ? (
        <Grid container spacing={2}>
          {filteredBatches.map((batch, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }} key={index}>
              <Card component={Paper} elevation={4}>
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
    </Box>
  );
};

export default Batch;
