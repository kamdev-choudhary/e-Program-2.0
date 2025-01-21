import { toast } from "react-toastify";

export type ToastType = "success" | "error" | "info" | "warn" | "default";

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number; // Auto-close duration in milliseconds
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
}

const toastService = ({
  message,
  type = "default",
  duration = 2000,
  position = "top-right",
}: ToastProps) => {
  const toastOptions = {
    position,
    autoClose: duration,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  // Show toast based on the type
  switch (type) {
    case "success":
      toast.success(message, toastOptions);
      break;
    case "error":
      toast.error(message, toastOptions);
      break;
    case "info":
      toast.info(message, toastOptions);
      break;
    case "warn":
      toast.warn(message, toastOptions);
      break;
    default:
      toast(message, toastOptions);
  }
};

export default toastService;
