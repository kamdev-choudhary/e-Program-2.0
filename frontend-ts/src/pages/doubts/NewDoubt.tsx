import React, { useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

import axios from "../../hooks/AxiosInterceptor";

interface NewDoubtInterface {
  setShowNewDoubtModal: (value: boolean) => void;
}

const NewDoubt: React.FC<NewDoubtInterface> = ({ setShowNewDoubtModal }) => {
  const [doubtQuestion, setDoubtQuestion] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [subject, setSubject] = useState<string>("");

  const handleSubmit = async () => {
    try {
      await axios.post("/doubts", {
        doubtQuestion,
        description,
        subject,
      });
      setShowNewDoubtModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box>
      <DialogTitle>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Post a New Doubt
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mt: 1,
          }}
        >
          {/* Doubt Question */}
          <TextField
            label="Doubt Question"
            variant="outlined"
            fullWidth
            value={doubtQuestion}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setDoubtQuestion(e.target.value)
            }
            required
          />

          {/* Description */}
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            multiline
            minRows={4}
            value={description}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setDescription(e.target.value)
            }
          />

          {/* Subject */}
          <TextField
            select
            label="Subject"
            variant="outlined"
            fullWidth
            value={subject}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSubject(e.target.value)
            }
            required
          >
            <MenuItem value="Physics">Physics</MenuItem>
            <MenuItem value="Chemistry">Chemistry</MenuItem>
            <MenuItem value="Mathematics">Mathematics</MenuItem>
            <MenuItem value="Biology">Biology</MenuItem>
          </TextField>
        </Box>
      </DialogContent>
      <DialogActions>
        {/* Cancel Button */}
        <Button
          onClick={() => setShowNewDoubtModal(false)}
          color="secondary"
          variant="outlined"
        >
          Cancel
        </Button>

        {/* Submit Button */}
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Submit
        </Button>
      </DialogActions>
    </Box>
  );
};

export default NewDoubt;
