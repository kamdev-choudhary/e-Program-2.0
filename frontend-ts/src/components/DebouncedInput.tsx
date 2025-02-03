import { TextField, TextFieldProps } from "@mui/material";
import React, { useState, useEffect, ChangeEvent } from "react";

interface DebouncedInputProps
  extends Omit<TextFieldProps, "onChange" | "value"> {
  value: string | number;
  onChange: (value: string | number) => void;
  delay?: number;
}

const DebouncedInput: React.FC<DebouncedInputProps> = ({
  value,
  onChange,
  delay = 300,
  ...props
}) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(debouncedValue);
    }, delay);

    return () => clearTimeout(handler);
  }, [debouncedValue, delay, onChange]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue =
      props.type === "number" ? Number(event.target.value) : event.target.value;
    setDebouncedValue(newValue);
  };

  return (
    <TextField {...props} value={debouncedValue} onChange={handleChange} />
  );
};

export default DebouncedInput;
