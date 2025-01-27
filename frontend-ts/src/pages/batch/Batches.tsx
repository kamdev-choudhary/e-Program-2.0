import {
  Paper,
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Grid2 as Grid,
  CardActions,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useAxios from "../../hooks/useAxios";

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
  const axios = useAxios();
  const navigate = useNavigate();
  const [batches, setBatches] = useState<Batch[] | null>(null);
  const [searchText, setSearchText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const filteredBatches = useMemo(() => {
    if (!batches) return []; // Return an empty array if batches is undefined or null
    const trimmedSearchText = searchText.toLowerCase().trim();
    return batches.filter((batch) => {
      return Object.values(batch).some((value) =>
        String(value).toLowerCase().includes(trimmedSearchText)
      );
    });
  }, [searchText, batches]);

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

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <TextField
          value={searchText}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchText(e.target.value)
          }
          label="Search"
          size="small"
          fullWidth
          sx={{ borderRadius: 10 }}
        />
      </Box>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <CircularProgress />
        </Box>
      ) : filteredBatches ? (
        <Grid container spacing={2}>
          {filteredBatches.map((batch, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }} key={index}>
              <Card component={Paper} elevation={4}>
                <CardMedia
                  component="img"
                  height="140"
                  image={batch.templateImage.url}
                  alt={batch.templateImage.title}
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
                    onClick={() => navigate(batch._id)}
                    sx={{ flex: 1, m: 1 }}
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
