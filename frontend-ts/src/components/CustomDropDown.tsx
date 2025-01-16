import { CloseRounded } from "@mui/icons-material";
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

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
}: CustomDropDownProps<T>) => {
  const handleClear = () => {
    onChange({ target: { value: "" } } as SelectChangeEvent);
  };

  return (
    <FormControl required={required} fullWidth>
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
          ) : (
            ""
          )
        }
      >
        {data &&
          data.map((item, index) => (
            <MenuItem
              key={index}
              value={String(item[dropdownValue])} // Ensure value is a string
            >
              {String(item[name])}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
};

export default CustomDropDown;
