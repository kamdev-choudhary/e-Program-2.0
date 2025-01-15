import { Box, Button, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";

interface AddBatch {
  setAddBatchModal: (value: boolean) => void;
}

interface NewBatch {
  title: string;
  class: string;
}

const AddBatch: React.FC<AddBatch> = ({ setAddBatchModal }) => {
  const [newBatch, setNewBatch] = useState<NewBatch>({ title: "", class: "" });

  useEffect(() => {
    setAddBatchModal(true);
  }, []);

  return (
    <Box
      sx={{
        maxWidth: 500,
        minWidth: 400,
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <TextField
        fullWidth
        value={newBatch?.title}
        label="Batch Name"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setNewBatch((prev) => ({ ...prev, name: e.target.value }))
        }
      />
      <Button fullWidth variant="contained">
        Save
      </Button>
    </Box>
  );
};

export default AddBatch;
