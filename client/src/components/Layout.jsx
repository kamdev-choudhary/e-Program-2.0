import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";

const drawerWidth = 240;

const Layout = () => {
  return (
    <div style={{ display: "flex" }}>
      <AppBar position="fixed" style={{ zIndex: 1100 }}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            Navbar
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        style={{ width: drawerWidth, flexShrink: 0 }}
        classes={{
          paper: { width: drawerWidth },
        }}
      >
        <div style={{ width: drawerWidth }} />
        <List>
          <ListItem button>
            <Typography variant="h6">Sidebar</Typography>
          </ListItem>
          {/* Add more list items for your sidebar content */}
        </List>
      </Drawer>
      <main
        style={{
          flexGrow: 1,
          backgroundColor: "#f0f0f0",
          padding: "20px",
          height: "calc(100vh - 64px)",
          overflowY: "auto",
        }}
      >
        <div style={{ height: "64px" }} />
        <Typography paragraph>Content inside the body goes here...</Typography>
        {/* Add more content here */}
      </main>
    </div>
  );
};

export default Layout;
