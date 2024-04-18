import { useState, useEffect } from "react";
import {
  Grid,
  Box,
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

export default function AdminPage() {
  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={6} md={4} lg={3}>
          <Card>
            <CardContent
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h5" component="div">
                Student Count
              </Typography>
              <Typography variant="body2">well meaning and kindly.</Typography>
            </CardContent>
            <CardActions style={{ display: "flex", justifyContent: "center" }}>
              <Button size="small">View Details</Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={6} md={4} lg={3}>
          <Card>
            <CardContent
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h5" component="div">
                Live Students
              </Typography>
              <Typography variant="body2">well meaning and kindly.</Typography>
            </CardContent>
            <CardActions style={{ display: "flex", justifyContent: "center" }}>
              <Button size="small">View Details</Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={6} md={4} lg={3}>
          <Card>
            <CardContent
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h5" component="div">
                benevolent
              </Typography>
              <Typography variant="body2">well meaning and kindly.</Typography>
            </CardContent>
            <CardActions style={{ display: "flex", justifyContent: "center" }}>
              <Button size="small">View Details</Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={6} md={4} lg={3}>
          <Card>
            <CardContent
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h5" component="div">
                benevolent
              </Typography>
              <Typography variant="body2">well meaning and kindly.</Typography>
            </CardContent>
            <CardActions style={{ display: "flex", justifyContent: "center" }}>
              <Button size="small">View Details</Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item sx={12} md={12} lg={6}>
          <BarChart
            series={[
              { data: [35, 44, 24, 34] },
              { data: [51, 6, 49, 30] },
              { data: [15, 25, 30, 50] },
              { data: [60, 50, 15, 25] },
            ]}
            height={290}
            xAxis={[{ data: ["Q1", "Q2", "Q3", "Q4"], scaleType: "band" }]}
            margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
          />
        </Grid>
      </Grid>
    </>
  );
}
