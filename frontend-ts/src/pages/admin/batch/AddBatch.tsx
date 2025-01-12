import { Box, Button, TextField } from "@mui/material";
import React, { useState } from "react";

interface AddBatch {
  setAddBatchModal?: (value: boolean) => void;
}

interface NewBatch {
  name: string;
}

const AddBatch: React.FC<AddBatch> = ({ setAddBatchModal }) => {
  const [newBatch, setNewBatch] = useState<NewBatch | null>(null);

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
        value={newBatch?.name}
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
