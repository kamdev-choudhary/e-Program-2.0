import { CloseRounded } from "@mui/icons-material";
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
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
          ) : null
        }
      >
        {data &&
          data.map((item, index) => {
            const itemValue =
              typeof item === "string" ? item : String(item[dropdownValue]);
            let itemLabel =
              typeof item === "string" ? item : String(item[name]);

            // Check if itemLabel is an actual date (contains "-" or "/" or "T")
            if (typeof itemLabel === "string" && /[-/T]/.test(itemLabel)) {
              itemLabel = moment(itemLabel).format("DD-MM-YYYY");
            }

            return (
              <MenuItem key={index} value={itemValue}>
                {itemLabel}
              </MenuItem>
            );
          })}
      </Select>
    </FormControl>
  );
};

export default CustomDropDown;
