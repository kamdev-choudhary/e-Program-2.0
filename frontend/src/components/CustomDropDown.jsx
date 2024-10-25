import { Close } from "@mui/icons-material";
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText,
} from "@mui/material";
import React from "react";
import { useGlobalProvider } from "../GlobalProvider";

function CustomDropDown({
  data = [],
  value = "",
  keyField = "id",
  onChange,
  disabled = false,
  label = "",
  name = "",
  dropdownValue = "",
  readonly = false,
  required = false,
  error = false,
  helperText = "",
}) {
  const { deviceTheme } = useGlobalProvider();

  // Function to clear the value
  const handleClear = () => {
    onChange({ target: { value: "" } });
  };

  return (
    <FormControl required={required} size="small" fullWidth error={error}>
      <InputLabel>{label}</InputLabel>
      <Select
        sx={{
          backgroundColor: deviceTheme === "light" ? "#fff" : "",
        }}
        label={label}
        value={value}
        onChange={onChange}
        disabled={disabled}
        readOnly={readonly}
        endAdornment={
          !readonly &&
          value !== "" && (
            <IconButton onClick={handleClear} sx={{ mr: 1 }}>
              <Close />
            </IconButton>
          )
        }
      >
        {data?.map((item, index) => {
          const itemName = item?.[name] || item;
          const itemValue = item?.[dropdownValue] || item;

          return (
            <MenuItem key={item?.[keyField] || index} value={itemValue}>
              {itemName}
            </MenuItem>
          );
        })}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}

export default CustomDropDown;
