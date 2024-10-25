import React from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { routes } from "../routes";
import { useGlobalProvider } from "../GlobalProvider";
import { Divider, Typography } from "@mui/material";
import { ChevronRightRounded, Home } from "@mui/icons-material";

function Body() {
  const { user, isLoggedIn } = useGlobalProvider();
  const location = useLocation();

  // Find the current route based on the path
  const currentRoute = routes.find((route) => route.path === location.pathname);

  return (
    <>
      {/* Display the name of the current route */}
      {currentRoute && (
        <>
          <Typography
            variant="h6"
            sx={{ mb: 1, display: "flex", alignItems: "center" }}
          >
            {currentRoute?.name?.split("/").map((part, index) => (
              <React.Fragment key={index}>
                {index === 0 ? (
                  <>
                    <Home sx={{ mx: 0.5 }} />
                    <ChevronRightRounded sx={{ mx: 0.5 }} />
                  </>
                ) : (
                  <ChevronRightRounded sx={{ mx: 0.5 }} />
                )}
                {part}
              </React.Fragment>
            ))}
          </Typography>
          <Divider
            sx={{
              mb: 2,
              bgcolor: "rgba(0,0,0,0.4)",
              height: "1px",
              border: "none",
            }}
          />
        </>
      )}

      <Routes>
        {routes
          .filter((route) => {
            if (!route.isLoginRequired) {
              return true;
            } else if (route.available.includes(user?.role)) {
              return true;
            } else {
              return false;
            }
          })
          .map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default Body;
