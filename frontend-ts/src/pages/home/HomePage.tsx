import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid2 as Grid,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// Sample data for cards (e.g., services or features)
const cards = [
  {
    title: "Browser Automation",
    description:
      "Automation for download multiple scholars City information with pdf.",
    path: "automation/jeemain/cityinfo",
  },
  {
    title: "2nd Browser Automation",
    description: "Automate to download multiple scholars admit card.",
    path: "automation/jeemain/admitcard",
  },
  {
    title: "Feature 3",
    description: "Description of feature 3.",
    path: "automation/jeemain/cityinfo",
  },
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Box>
      {/* Header */}
      <Box sx={{ color: "white", py: 2 }}>
        <Container>
          <Typography variant="h4" align="center">
            Welcome to Our Website
          </Typography>
          <Typography variant="h6" align="center">
            A place to learn and grow
          </Typography>
        </Container>
      </Box>

      {/* Main Content */}
      <Container sx={{ my: 1 }}>
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Introduction
            </Typography>
            <Typography variant="body1">
              This is a simple homepage showcasing the power of Material-UI
              components to quickly design an app.
            </Typography>
          </CardContent>
          <CardActions>
            <Button variant="outlined" color="primary">
              Learn More
            </Button>
          </CardActions>
        </Card>
        <Grid container spacing={2}>
          {/* Displaying Feature Cards */}
          {cards.map((card, index) => (
            <Grid size={{ xs: 12, md: 8, lg: 6 }} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    {card.title}
                  </Typography>
                  <Typography variant="body2">{card.description}</Typography>
                </CardContent>
                <CardActions>
                  <Button
                    onClick={() => navigate(card.path)}
                    variant="outlined"
                    color="primary"
                  >
                    Explore
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer */}
      <Box sx={{ py: 2 }}>
        <Container>
          <Typography variant="body2" align="center">
            © 2025 My Website | All Rights Reserved
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
