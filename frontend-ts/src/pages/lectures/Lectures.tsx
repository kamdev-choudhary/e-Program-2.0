import {
  Box,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { getClasses } from "../../api/academic";

const Lectures: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<string>("");

  // Fetch lectures by class using React Query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [`selectedClass`],
    queryFn: () => getClasses(),
  });

  // Extract classes from data if available
  const classes = data?.status === 200 ? data.data.classes : [];

  return (
    <Box component={Paper} sx={{ p: 2, m: 2, height: "80vh" }}>
      {/* Class selection dropdown */}
      <FormControl fullWidth>
        <InputLabel>Select Class</InputLabel>
        <Select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          label="Select Class"
        >
          {classes && classes.length > 0 ? (
            classes.map((classItem: any) => (
              <MenuItem key={classItem.value} value={classItem.value}>
                {classItem.name}
              </MenuItem>
            ))
          ) : (
            <MenuItem value="" disabled>
              No classes available
            </MenuItem>
          )}
        </Select>
      </FormControl>

      <Divider sx={{ mt: 1 }} />

      <Box>
        <Typography variant="h5">Youtube Lectures</Typography>
      </Box>

      {/* Error message */}
      {isError && (
        <Typography color="error" mt={2}>
          An error occurred:{" "}
          {(error as Error)?.message || "Unable to fetch data."}
        </Typography>
      )}

      {isLoading && <Typography mt={2}>Loading classes...</Typography>}
    </Box>
  );
};

export default Lectures;
