import React from "react";
import { Box, Breadcrumbs, Link as MuiLink, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { useLocation, Link } from "react-router-dom";

const UrlSegmentsProgress: React.FC = () => {
  const location = useLocation();
  const urlSegments = location.pathname
    .split("/")
    .filter((segment) => segment !== "");

  return (
    <Box sx={{ padding: 1, borderBottom: "1px solid rgba(0,0,0,0.2)", mb: 1 }}>
      <Breadcrumbs
        aria-label="breadcrumb"
        separator="›"
        sx={{
          "& .MuiBreadcrumbs-ol": {
            alignItems: "center",
          },
        }}
      >
        <MuiLink
          component={Link}
          to="/"
          color="inherit"
          sx={{
            display: "flex",
            alignItems: "center",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          <HomeIcon fontSize="small" sx={{ marginRight: 0.5 }} />
          Home
        </MuiLink>
        {urlSegments.map((segment, index) => {
          const segmentPath = "/" + urlSegments.slice(0, index + 1).join("/");
          return index === urlSegments.length - 1 ? (
            <Typography
              key={index}
              color="text.primary"
              sx={{ textTransform: "capitalize" }}
              aria-current="page"
            >
              {segment}
            </Typography>
          ) : (
            <MuiLink
              key={index}
              component={Link}
              to={segmentPath}
              color="inherit"
              sx={{
                textTransform: "capitalize",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {segment}
            </MuiLink>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default UrlSegmentsProgress;
