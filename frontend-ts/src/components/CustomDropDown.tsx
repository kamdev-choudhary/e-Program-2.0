import { CloseRounded } from "@mui/icons-material";
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  FormHelperText,
} from "@mui/material";
import moment from "moment";

interface CustomDropDownProps<T extends Record<string, any>> {
  data: Array<T>;
  value: string;
  onChange: (event: SelectChangeEvent) => void;
  disabled?: boolean;
  label: string;
  name: keyof T & string;
  dropdownValue: keyof T & string;
  readonly?: boolean;
  required?: boolean;
  showClearButton?: boolean;
  error?: boolean; // Optional error prop
  errorMessage?: string; // Optional error message prop
}

const CustomDropDown = <T extends Record<string, any>>({
  data = [],
  value = "",
  onChange,
  disabled = false,
  label = "",
  name,
  dropdownValue,
  readonly = false,
  required = false,
  showClearButton = true,
  error = false, // Default to false
  errorMessage = "", // Default to empty string
}: CustomDropDownProps<T>) => {
  const handleClear = () => {
    onChange({ target: { value: "" } } as SelectChangeEvent);
  };

  return (
    <FormControl size="small" required={required} fullWidth error={error}>
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        value={value}
        onChange={onChange}
        disabled={disabled}
        readOnly={readonly}
        endAdornment={
          !readonly && value !== "" && showClearButton ? (
            <IconButton onClick={handleClear} sx={{ mr: 1 }}>
              <CloseRounded />
            </IconButton>
          ) : null
        }
      >
        {data &&
          data.map((item, index) => {
            const itemValue =
              typeof item === "string" ? item : String(item[dropdownValue]);
            let itemLabel =
              typeof item === "string" ? item : String(item[name]);

            if (
              typeof itemLabel === "string" &&
              moment(itemLabel, moment.ISO_8601, true).isValid()
            ) {
              itemLabel = moment(itemLabel).format("DD-MM-YYYY");
            }

            return (
              <MenuItem key={index} value={itemValue}>
                {itemLabel}
              </MenuItem>
            );
          })}
      </Select>
      {error && <FormHelperText>{errorMessage}</FormHelperText>}
    </FormControl>
  );
};

export default CustomDropDown;
