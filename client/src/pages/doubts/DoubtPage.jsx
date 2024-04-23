import * as React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "../../store/Auth";
import { TinyBox } from "../../components/TinyBox";

import {
  Box,
  Button,
  Typography,
  Modal,
  Grid,
  Select,
  MenuItem,
  Skeleton,
  FormControl,
  Divider,
  IconButton,
  Stack,
  CircularProgress,
} from "@mui/material";

import { Delete as DeleteIcon } from "@mui/icons-material";

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
        updatedDoubt.doubtSolutions.push(data.solution);
        setCurrDoubt(updatedDoubt);
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

  const handleDeleteDoubtPost = (id) => {
    fetch(`${API_URL}/doubts/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          console.log("Doubt deleted successfully");
          return response.json();
        } else {
          console.error("Failed to delete doubt");
          throw new Error("Failed to delete doubt");
        }
      })
      .then((data) => {
        const newData = doubts.filter((item) => item._id !== id);
        setDoubts(newData);
        setDoubtDetails(false);
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mt: 2,
          }}
        >
          <Skeleton
            sx={{ borderRadius: 10 }}
            variant="rectangular"
            width={200}
            height={20}
          />
        </Box>
        <br />
        <Stack spacing={2}>
          {[...Array(5)].map((_, index) => (
            <>
              <Box
                key={index}
                sx={{
                  marginBottom: 1,
                  padding: 2,
                  borderRadius: 3,
                  border: "2px solid rgba(0,0,0,0.1)",
                }}
              >
                <Skeleton variant="rounded" height={100} />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mt: 2,
                  }}
                >
                  <Skeleton
                    sx={{ borderRadius: 10 }}
                    variant="rectangular"
                    width={200}
                    height={5}
                  />
                </Box>
              </Box>
            </>
          ))}
        </Stack>
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
            variant="outlined"
            color="secondary"
            sx={{ borderRadius: 10 }}
            onClick={() => {
              setShowAskDoubtForm(true), setModelText("Ask a Doubt");
            }}
          >
            Ask a Doubt
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
                <Box
                  key={index}
                  sx={{
                    marginBottom: 1,
                    padding: 2,
                    borderRadius: 3,
                    border: "2px solid rgba(0,0,0,0.3)",
                  }}
                >
                  <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2} justifyContent="space-between">
                      <Grid item xs={8} sx={{ opacity: "0.7" }}>
                        <Typography sx={{ marginBottom: 1 }}>
                          Posted By: {doubt.postedBy}
                        </Typography>
                      </Grid>
                      <Grid item xs={4} textAlign="right">
                        <Typography sx={{ opacity: "0.7" }}>
                          {new Date(doubt.doubtPostedDate).toLocaleDateString()}{" "}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                  <Box
                    border="1.5px solid rgba(128, 128, 128, 0.5)"
                    sx={{ padding: 1, borderRadius: 1 }}
                  >
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
                    {doubt.doubtSolutions && doubt.doubtSolutions.length > 0 ? (
                      <Button
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
                </Box>
              ))}
        </>
      )}
      {doubtDetails && (
        <>
          <Button
            variant="outlined"
            color="error"
            sx={{ borderRadius: 10, marginBottom: 1 }}
            onClick={() => setDoubtDetails(false)}
          >
            Back
          </Button>

          <Box
            sx={{
              marginBottom: 1,
              padding: 2,
              borderRadius: 3,
              border: "2px solid rgba(0,0,0,0.3)",
            }}
          >
            <Grid container spacing={1}>
              <Grid item xs={11} lg={11} md={11}>
                <Typography variant="h5">Question</Typography>
              </Grid>
              {isAdmin ||
              (currDoubt.postedById && currDoubt.postedById === userId) ? (
                <Grid item xs={1} lg={1} md={1}>
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleDeleteDoubtPost(currDoubt._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              ) : null}
              <Grid item xs={12} lg={12} md={12}>
                <Typography
                  sx={{
                    overflow: "hidden",
                    maxWidth: "100%",
                    padding: 1,
                  }}
                  dangerouslySetInnerHTML={{
                    __html: currDoubt.doubtQuestion,
                  }}
                />
              </Grid>
              <Grid item xs={6} lg={6} md={6}>
                <Typography variant="h5">Solutions</Typography>
              </Grid>
              <Grid item xs={6} lg={6} md={6}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
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
              <Grid item xs={12} md={12} lg={12}>
                {currDoubt.doubtSolutions &&
                  currDoubt.doubtSolutions.map((solution, index) => (
                    <>
                      <Box
                        sx={{
                          marginBottom: 1,
                          padding: 2,
                          borderRadius: 3,
                          border: "2px solid rgba(0,0,0,0.3)",
                        }}
                        key={index}
                      >
                        <Grid
                          container
                          spacing={2}
                          justifyContent="space-between"
                        >
                          <Grid item xs={8}>
                            <Typography sx={{ opacity: "0.7" }}>
                              Posted By: {solution.postedBy}
                            </Typography>
                          </Grid>
                          <Divider />
                          <Grid item xs={4} textAlign="right">
                            <Typography sx={{ opacity: "0.7" }}>
                              {new Date(
                                solution.solutionPostedDate
                              ).toLocaleDateString()}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Typography
                          sx={{
                            overflow: "hidden",
                            maxWidth: "100%",
                            padding: 1,
                          }}
                          dangerouslySetInnerHTML={{
                            __html: solution.solution,
                          }}
                        />
                      </Box>
                    </>
                  ))}
              </Grid>
            </Grid>
          </Box>
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
