import {
  Box,
  Button,
  SelectChangeEvent,
  TextField,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import React, { useEffect, useRef, useState } from "react";
import CustomDropDown from "../../../components/CustomDropDown";
import axios from "../../../hooks/AxiosInterceptor";

interface AddBatch {
  setAddBatchModal: (value: boolean) => void;
}

interface NewBatch {
  name: string;
  class: string;
  description: string;
  session: string;
  stream: string;
}

const AddBatch: React.FC<AddBatch> = ({ setAddBatchModal }) => {
  const [newBatch, setNewBatch] = useState<NewBatch>({
    name: "",
    class: "",
    description: "",
    session: "",
    stream: "",
  });
  const [classes, setClasses] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitialData = async () => {
    try {
      const classResponse = await axios.get("/academic/class");
      setClasses(classResponse.data.classes);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input value
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("name", newBatch.name);
    formData.append("class", newBatch.class);
    formData.append("description", newBatch.description);
    if (selectedFile) {
      formData.append("photo", selectedFile);
    }
    try {
      await axios.post("/batch", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setAddBatchModal(false);
    } catch (error) {
      console.error("Failed to save batch:", error);
    }
  };

  useEffect(() => {
    getInitialData();
    setAddBatchModal(true);
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: 350,
      }}
    >
      <CustomDropDown
        data={classes}
        value={newBatch.class}
        name="name"
        dropdownValue="value"
        onChange={(e: SelectChangeEvent) =>
          setNewBatch((prev) => ({ ...prev, class: e.target.value }))
        }
        label="Batch Class"
      />
      <TextField
        size="small"
        fullWidth
        value={newBatch?.name}
        label="Batch Name"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setNewBatch((prev) => ({ ...prev, name: e.target.value }))
        }
      />
      <TextField
        label="Batch Description"
        minRows={4}
        multiline
        fullWidth
        value={newBatch.description}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setNewBatch((prev) => ({ ...prev, description: e.target.value }))
        }
      />
      <OutlinedInput
        size="small"
        fullWidth
        inputRef={fileInputRef}
        type="file"
        onChange={handleFileChange}
        inputProps={{ accept: "image/*" }}
        endAdornment={
          selectedFile && (
            <InputAdornment position="end">
              <IconButton onClick={handleRemoveFile}>
                <CloseIcon />
              </IconButton>
            </InputAdornment>
          )
        }
      />
      <TextField
        value={newBatch.session}
        size="small"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setNewBatch((prev) => ({ ...prev, session: e.target.value }))
        }
        fullWidth
        label="Batch Session"
      />
      <TextField
        size="small"
        value={newBatch.stream}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setNewBatch((prev) => ({ ...prev, stream: e.target.value }))
        }
        fullWidth
        label="Batch Stream"
      />

      <Button fullWidth variant="contained" onClick={handleSave}>
        Save
      </Button>
    </Box>
  );
};

export default AddBatch;
