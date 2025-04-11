import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import React, { ReactNode } from "react";

interface CustomDialogProps {
  open: boolean;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
  title?: string;
  children: ReactNode;
  onClose?: () => void;
  fullwidth?: boolean;
}
const CustomDialog: React.FC<CustomDialogProps> = ({
  open,
  maxWidth = "md",
  title = "",
  children,
  onClose,
  fullwidth,
}) => {
  return (
    <Dialog
      open={open}
      maxWidth={maxWidth}
      onClose={onClose}
      fullWidth={fullwidth}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
};

export default CustomDialog;
