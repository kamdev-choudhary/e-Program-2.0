import React, { useRef } from "react";
import { Box, IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useGlobalProvider } from "../GlobalProvider";

const ScrollableTabs = ({ tabs, selectedTab, setSelectedTab }) => {
  const boxRef = useRef(null);
  const { deviceTheme } = useGlobalProvider();

  const scrollLeft = () => {
    if (boxRef.current) {
      boxRef.current.scrollBy({
        left: -200,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (boxRef.current) {
      boxRef.current.scrollBy({
        left: 200,
        behavior: "smooth",
      });
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", my: 1 }}>
      {/* <IconButton onClick={scrollLeft} disabled={!boxRef.current?.scrollLeft}>
        <ArrowBackIosIcon />
      </IconButton> */}
      <Box
        ref={boxRef}
        sx={{
          display: "flex",
          flexDirection: "row",
          columnGap: 2,
          overflowX: "auto", // Allow horizontal scrolling
          overflowY: "hidden", // Hide vertical scrollbar
          flexGrow: 1, // Ensure the box takes up remaining space
          scrollbarWidth: "none", // For Firefox
          "&::-webkit-scrollbar": {
            // For Chrome, Safari and Edge
            display: "none",
          },
        }}
      >
        {tabs?.map((tab, index) => (
          <div
            style={{
              padding: 2,
              flexGrow: 0, // Allow items to maintain their size
              cursor: "pointer",
            }}
            onClick={() => setSelectedTab(tab?.value)}
            key={index}
          >
            <span
              style={{
                display: "flex",
                justifyContent: "center",
                paddingBottom: 5,
                borderBottom:
                  selectedTab === tab.value ? "4px solid #3f51b5" : "",
                color:
                  selectedTab === tab.value
                    ? deviceTheme === "light"
                      ? "#3f51b5"
                      : ""
                    : "",
                columnGap: 4,
                alignItems: "center",
                minWidth: 200, // Adjust based on your layout needs
              }}
            >
              <img
                style={{ marginRight: "4px" }}
                width={30}
                height={30}
                src={tab.icon}
                alt={"icon"}
              />

              {tab?.name}
            </span>
          </div>
        ))}
      </Box>
      {/* <IconButton
        onClick={scrollRight}
        disabled={!boxRef.current?.scrollWidth - boxRef.current?.clientWidth}
      >
        <ArrowForwardIosIcon />
      </IconButton> */}
    </Box>
  );
};

export default ScrollableTabs;
