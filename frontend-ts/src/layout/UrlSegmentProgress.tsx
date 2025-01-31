import React from "react";
import { Breadcrumbs, Link as MuiLink, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { useLocation, Link } from "react-router-dom";

const UrlSegmentsProgress: React.FC = () => {
  const location = useLocation();
  const urlSegments = location.pathname
    .split("/")
    .filter((segment) => segment !== "");

  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      separator="›"
      sx={{
        "& .MuiBreadcrumbs-ol": {
          alignItems: "center",
        },
        p: 1,
        mb: 1,
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
        <HomeIcon sx={{ marginRight: 0.5 }} />
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
  );
};

export default UrlSegmentsProgress;
