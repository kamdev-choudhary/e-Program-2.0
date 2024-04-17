import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { TinyBox } from "../components/TinyBox";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { useAuth } from "../components/Auth";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export default function DoubtPage() {
  const { isLoggedIn, isAdmin, name, userId } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState("All");
  const [showAskDoubtForm, setShowAskDoubtForm] = useState(false);
  const [doubts, setDoubts] = useState([]);
  const [currDoubt, setCurrDoubt] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [doubtDetails, setDoubtDetails] = useState(false);
  const [modalText, setModelText] = useState("");
  const [newDoubt, setNewDoubt] = useState({
    doubtQuestion: "",
  });

  useEffect(() => {
    fetch(`${API_URL}/doubts`)
      .then((response) => response.json())
      .then((data) => {
        setDoubts(data.doubts);
        setIsLoading(false);
      })
      .catch((error) => console.log("Error", error));
  }, [refresh]);

  const handlePostDoubt = () => {
    const data = {
      doubtQuestion: newDoubt.doubtQuestion,
      postedBy: isLoggedIn ? name : "Annonymous ",
      postedById: isLoggedIn ? userId : "Annonymous ",
    };
    fetch(`${API_URL}/doubts/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
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

  const handlePostDoubtSolution = () => {
    const data = {
      solution: newDoubt.doubtQuestion,
      postedBy: isLoggedIn ? name : "Annonymous ",
      postedById: isLoggedIn ? userId : "Annonymous ",
    };
    fetch(`${API_URL}/doubts/${currDoubt._id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((data) => {
        console.log("Success:", data);
        const updatedDoubt = { ...currDoubt };
        updatedDoubt.doubtSolutions.push(data.solution); // Assuming the new solution is returned from the server
        setCurrDoubt(updatedDoubt);
        setRefresh(!refresh); // Optionally trigger a refresh
        setShowAskDoubtForm(false);
        setNewDoubt(() => ({
          doubtQuestion: "",
        }));
      })
      .catch((error) => {
        console.error("Error:", error);
      });
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

  if (isLoading) {
    return (
      <>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </>
    );
  }

  return (
    <>
      {!doubtDetails && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 2,
          }}
        >
          <FormControl sx={{ minWidth: 200 }} size="small">
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            >
              <MenuItem value="All">All Doubts</MenuItem>
              <MenuItem value="solved">Solved Doubts</MenuItem>
              <MenuItem value="unsolved">Unsolved</MenuItem>
              {isLoggedIn && <MenuItem value="your">Your Doubts</MenuItem>}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="success"
            sx={{ borderRadius: 10 }}
            onClick={() => {
              setShowAskDoubtForm(true), setModelText("Ask a Doubt");
            }}
          >
            Add New
          </Button>
        </Box>
      )}
      {!doubtDetails && (
        <>
          {doubts &&
            doubts
              .filter((doubt) => {
                if (value === "All") {
                  return true;
                } else if (value === "solved") {
                  return (
                    doubt.doubtSolutions && doubt.doubtSolutions.length > 0
                  );
                } else if (value === "unsolved") {
                  return !(
                    doubt.doubtSolutions && doubt.doubtSolutions.length > 0
                  );
                } else if (value === "your") {
                  return doubt.postedById && doubt.postedById === userId;
                }
              })
              .sort(
                (a, b) =>
                  new Date(b.doubtPostedDate) - new Date(a.doubtPostedDate)
              )
              .map((doubt, index) => (
                <Box sx={{ marginBottom: 1 }} key={index}>
                  <Paper
                    sx={{
                      padding: 3,
                      backgroundColor: "#f5f5f5",
                      backdropFilter: "blur(5px)",
                      borderRadius: 1,
                    }}
                    elevation={6}
                  >
                    <Box sx={{ flexGrow: 1 }}>
                      <Grid
                        container
                        spacing={2}
                        justifyContent="space-between"
                      >
                        <Grid item xs={8}>
                          <Typography>Posted By: {doubt.postedBy}</Typography>
                        </Grid>
                        <Grid item xs={4} textAlign="right">
                          <Typography>
                            {new Date(
                              doubt.doubtPostedDate
                            ).toLocaleDateString()}{" "}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                    <Box border={1} sx={{ padding: 1, borderRadius: 2 }}>
                      <Typography
                        sx={{
                          overflow: "hidden",
                          maxWidth: "100%",
                        }}
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
                      doubt.doubtSolutions.length > 0 ? (
                        <Button
                          variant="outlined"
                          color="success"
                          sx={{ borderRadius: 10 }}
                          onClick={() => {
                            setDoubtDetails(true);
                            setCurrDoubt(doubt);
                          }}
                        >
                          View Solutions
                        </Button>
                      ) : (
                        <Button
                          variant="outlined"
                          sx={{ borderRadius: 10 }}
                          onClick={() => {
                            setDoubtDetails(true);
                            setCurrDoubt(doubt);
                          }}
                        >
                          Post a Solution
                        </Button>
                      )}
                    </Box>
                  </Paper>
                </Box>
              ))}
        </>
      )}
      {doubtDetails && (
        <>
          <Button
            variant="outlined"
            color="error"
            sx={{ borderRadius: 10 }}
            onClick={() => setDoubtDetails(false)}
          >
            Back
          </Button>
          <hr />
          <Typography variant="h5">Question</Typography>
          <hr />
          <Paper
            elevation={6}
            sx={{
              padding: 2,
              backgroundColor: "#f1f1f1",
              backdropFilter: "blur(5px)",
              borderRadius: 1,
            }}
          >
            <Box border={1} sx={{ padding: 1, borderRadius: 2, marginTop: 1 }}>
              <Typography
                sx={{
                  overflow: "hidden",
                  maxWidth: "100%",
                }}
                dangerouslySetInnerHTML={{
                  __html: currDoubt.doubtQuestion,
                }}
              />
            </Box>
          </Paper>

          <hr />
          <Box>
            <Grid container>
              <Grid item xs={12} lg={6} md={6}>
                <Typography variant="h5">Solutions</Typography>
              </Grid>
              <Grid item xs={12} lg={6} md={6}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    variant="contained"
                    color="success"
                    sx={{ borderRadius: 10 }}
                    onClick={() => {
                      setShowAskDoubtForm(true),
                        setModelText("Post a Solution");
                    }}
                  >
                    Post a solution
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <hr />

          {currDoubt.doubtSolutions &&
            currDoubt.doubtSolutions.map((solution, index) => (
              <Paper
                elevation={6}
                sx={{
                  padding: 3,
                  backgroundColor: "#f1f1f1",
                  backdropFilter: "blur(5px)",
                  borderRadius: 1,
                  marginBottom: 2,
                }}
              >
                <>
                  <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2} justifyContent="space-between">
                      <Grid item xs={8}>
                        <Typography>Posted By: {solution.postedBy}</Typography>
                      </Grid>
                      <Grid item xs={4} textAlign="right">
                        <Typography>
                          {new Date(
                            solution.solutionPostedDate
                          ).toLocaleDateString()}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                  <Box
                    border={1}
                    sx={{ padding: 1, borderRadius: 2, marginTop: 2 }}
                    key={index}
                  >
                    <Typography
                      sx={{
                        overflow: "hidden",
                        maxWidth: "100%",
                      }}
                      dangerouslySetInnerHTML={{
                        __html: solution.solution,
                      }}
                    />
                  </Box>
                </>
              </Paper>
            ))}
        </>
      )}
      <Modal
        open={showAskDoubtForm}
        onClose={() => setShowAskDoubtForm(false)}
        aria-labelledby="ask-doubt"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} display="flex" flexDirection="column">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {modalText}
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
              sx={{ borderRadius: 10, mr: 1 }}
              onClick={() => setShowAskDoubtForm(false)}
            >
              Close
            </Button>
            {doubtDetails ? (
              <Button
                variant="contained"
                color="success"
                sx={{ borderRadius: 10 }}
                onClick={handlePostDoubtSolution}
              >
                Post solution
              </Button>
            ) : (
              <Button
                variant="contained"
                color="success"
                sx={{ borderRadius: 10 }}
                onClick={handlePostDoubt}
              >
                Post
              </Button>
            )}
          </Box>
        </Box>
      </Modal>
    </>
  );
}
