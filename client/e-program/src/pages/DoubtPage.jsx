import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { TinyBox } from "../components/TinyBox";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export default function DoubtPage() {
  const [value, setValue] = React.useState("1");
  const [showAskDoubtForm, setShowAskDoubtForm] = useState(false);
  const [doubts, setDoubts] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [newDoubt, setNewDoubt] = useState({
    doubtQuestion: "",
  });

  useEffect(() => {
    fetch(`${API_URL}/doubts`)
      .then((response) => response.json())
      .then((data) => setDoubts(data.doubts))
      .catch((error) => console.log("Error", error));
  }, [refresh]);

  const handlePostDoubt = () => {
    const data = {
      doubtQuestion: newDoubt.doubtQuestion,
      postedBy: "",
      posttedById: "",
    };
    fetch(`${API_URL}/doubts/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        response.json();
        if (response.ok) {
        }
      })
      .then((data) => {
        console.log("Success:", data);
        setRefresh(!refresh);
        setShowAskDoubtForm(false);
        setNewDoubt(() => ({
          doubtQuestion: "",
        }));
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const style = {
    position: "absolute",
    width: "90%",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
  };

  return (
    <>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <FormControl variant="standard">
              <Select
                labelId="tab-select-label"
                id="tab-select"
                value={value}
                onChange={handleChange}
              >
                <MenuItem value="1">All</MenuItem>
                <MenuItem value="2">Unsolved Doubts</MenuItem>
                <MenuItem value="3">Solved Doubts</MenuItem>
                <MenuItem value="4">Your Doubts</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="success"
              onClick={() => setShowAskDoubtForm(true)}
            >
              Add New
            </Button>
          </Box>

          <TabPanel value="1">
            <>
              {doubts &&
                doubts.map((doubt, index) => (
                  <Box sx={{ marginBottom: 1 }} key={index}>
                    <Paper sx={{ padding: 3 }} elevation={6}>
                      <Typography sx={{ marginBottom: 1 }}>
                        Posted By: Anonymous User
                      </Typography>
                      <Box border={1} sx={{ padding: 1, borderRadius: 2 }}>
                        <Typography
                          dangerouslySetInnerHTML={{
                            __html: doubt.doubtQuestion,
                          }}
                        />
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          mt: 2,
                        }}
                      >
                        {doubt.doubtSolutions &&
                          doubt.doubtSolutions.length > 0 && (
                            <Button>View Solutions</Button>
                          )}
                        <Button>Post a solution</Button>
                      </Box>
                    </Paper>
                  </Box>
                ))}
            </>
          </TabPanel>
          <TabPanel value="2">Item Two</TabPanel>
          <TabPanel value="3">Item Three</TabPanel>
        </TabContext>
      </Box>

      <Modal
        open={showAskDoubtForm}
        onClose={() => setShowAskDoubtForm(false)}
        aria-labelledby="ask-doubt"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} display="flex" flexDirection="column">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Ask a doubt
          </Typography>
          <hr />
          <TinyBox
            content={newDoubt.doubtQuestion}
            onContentChange={(newContent) =>
              setNewDoubt(() => ({
                doubtQuestion: newContent,
              }))
            }
          />

          <hr />
          <Box sx={{ mt: 2, alignSelf: "flex-end" }}>
            <Button
              variant="contained"
              color="error"
              onClick={() => setShowAskDoubtForm(false)}
              sx={{ mr: 1 }}
            >
              Close
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={handlePostDoubt}
            >
              Post
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
