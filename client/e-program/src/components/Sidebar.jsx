import { useState } from "react";
import { NavLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea } from "@mui/material";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import QuizIcon from "@mui/icons-material/Quiz";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ForumIcon from "@mui/icons-material/Forum";
import OndemandVideoRoundedIcon from "@mui/icons-material/OndemandVideoRounded";
import DescriptionIcon from "@mui/icons-material/Description";
import SchoolIcon from "@mui/icons-material/School";
import { useAuth } from "./Auth";
import Typography from "@mui/material/Typography";

export default function Sidebar() {
  const { isLoggedIn, isAdmin, accountType, name, logoutUser } = useAuth();

  return (
    <>
      <Box
        sx={{
          backgroundColor: "#f5f5f5",
          padding: 2,
          height: "100%",
          minWidth: 250,
        }}
      >
        <Box
          sx={{
            margin: 3,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Card sx={{ maxWidth: 100, maxHeight: 100, padding: 2 }}>
            <CardActionArea>
              <CardMedia
                component="img"
                height="60"
                image="/main_logo.png"
                alt="green iguana"
              />
            </CardActionArea>
          </Card>
        </Box>
        {isLoggedIn && (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography>{`Welcome,`}</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography>{`${name}`}</Typography>
            </Box>
          </>
        )}
        <hr />
        <Box>
          <List
            sx={{ width: "100%", maxWidth: 360 }}
            component="nav"
            aria-labelledby="nested-list-subheader"
          >
            {isAdmin && (
              <>
                <NavLink
                  to="/admin"
                  style={{ textDecoration: "none", color: "#000" }}
                >
                  <ListItemButton>
                    <ListItemIcon>
                      <AdminPanelSettingsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                  </ListItemButton>
                </NavLink>
                <NavLink
                  to="/academic"
                  style={{ textDecoration: "none", color: "#000" }}
                >
                  <ListItemButton>
                    <ListItemIcon>
                      <SchoolIcon />
                    </ListItemIcon>
                    <ListItemText primary="Academic" />
                  </ListItemButton>
                </NavLink>
                <NavLink
                  to="/users"
                  style={{ textDecoration: "none", color: "#000" }}
                >
                  <ListItemButton>
                    <ListItemIcon>
                      <PeopleAltIcon />
                    </ListItemIcon>
                    <ListItemText primary="User Master" />
                  </ListItemButton>
                </NavLink>
                <NavLink
                  to="/question-bank"
                  style={{ textDecoration: "none", color: "#000" }}
                >
                  <ListItemButton>
                    <ListItemIcon>
                      <QuizIcon />
                    </ListItemIcon>
                    <ListItemText primary="Question Bank" />
                  </ListItemButton>
                </NavLink>
              </>
            )}

            <NavLink
              to="/lectures"
              style={{ textDecoration: "none", color: "#000" }}
            >
              <ListItemButton>
                <ListItemIcon>
                  <OndemandVideoRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="Lectures" />
              </ListItemButton>
            </NavLink>
            <NavLink
              to="/materials"
              style={{ textDecoration: "none", color: "#000" }}
            >
              <ListItemButton>
                <ListItemIcon>
                  <LibraryBooksIcon />
                </ListItemIcon>
                <ListItemText primary="Materials" />
              </ListItemButton>
            </NavLink>
            {isLoggedIn && accountType === "student" && (
              <>
                <NavLink
                  to="/exams"
                  style={{ textDecoration: "none", color: "#000" }}
                >
                  <ListItemButton>
                    <ListItemIcon>
                      <DescriptionIcon />
                    </ListItemIcon>
                    <ListItemText primary="Exams" />
                  </ListItemButton>
                </NavLink>
              </>
            )}
            <NavLink
              to="/doubts"
              style={{ textDecoration: "none", color: "#000" }}
            >
              <ListItemButton>
                <ListItemIcon>
                  <ForumIcon />
                </ListItemIcon>
                <ListItemText primary="Doubts" />
              </ListItemButton>
            </NavLink>
          </List>
        </Box>
      </Box>
    </>
  );
}
