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
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import { useAuth } from "../store/Auth";
import Typography from "@mui/material/Typography";

export default function Sidebar({ toggleDrawer }) {
  const { isLoggedIn, isAdmin, accountType, name, logoutUser } = useAuth();
  const [examMasterOpen, setExamMasterOpen] = useState(false);

  const handleExamMasterClick = () => {
    setExamMasterOpen(!examMasterOpen);
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: "#f5f5f5",
          padding: 2,
          height: "100%",
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
          <List component="nav" aria-labelledby="nested-list-subheader">
            {isLoggedIn && (
              <NavLink
                to="/dashboard"
                style={{ textDecoration: "none", color: "#000" }}
              >
                <ListItemButton onClick={() => toggleDrawer(false)}>
                  <ListItemIcon>
                    <AdminPanelSettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItemButton>
              </NavLink>
            )}
            {isAdmin && (
              <>
                <ListItemButton onClick={handleExamMasterClick}>
                  <ListItemIcon>
                    <DescriptionIcon />
                  </ListItemIcon>
                  <ListItemText primary="Exam Master" />
                  {examMasterOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={examMasterOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <NavLink
                      to="/exammaster/offline"
                      style={{ textDecoration: "none", color: "#000" }}
                    >
                      <ListItemButton sx={{ pl: 4 }}>
                        <ListItemIcon>
                          <DescriptionIcon />
                        </ListItemIcon>
                        <ListItemText primary="Offline Exams" />
                      </ListItemButton>
                    </NavLink>
                    <NavLink
                      to="/exammaster/online"
                      style={{ textDecoration: "none", color: "#000" }}
                    >
                      <ListItemButton sx={{ pl: 4 }}>
                        <ListItemIcon>
                          <DescriptionIcon />
                        </ListItemIcon>
                        <ListItemText primary="Online Exams" />
                      </ListItemButton>
                    </NavLink>
                  </List>
                </Collapse>
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
