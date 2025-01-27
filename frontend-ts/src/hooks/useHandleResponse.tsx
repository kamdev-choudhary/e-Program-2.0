import { useNotification } from "../contexts/NotificationProvider";

interface Response {
  status: number;
  data: {
    message?: string;
    status_code?: number;
    [key: string]: any;
  };
}

const useHandleResponse = () => {
  const { showNotification } = useNotification();

  const handleResponse = (response: Response) => {
    const status = response.status;
    const message = response.data.message || "An unexpected error occurred.";

    switch (status) {
      // **2xx Success**
      case 200:
        showNotification({
          message: message || "Request successful.",
          type: "success",
        });
        break;
      case 201:
        showNotification({
          message: message || "Resource created successfully.",
          type: "success",
        });
        break;
      case 202:
        showNotification({
          message: "Request accepted but processing is not complete.",
          type: "info",
        });
        break;
      case 204:
        showNotification({
          message: "No content, but the request was successful.",
          type: "info",
        });
        break;

      // **3xx Redirection**
      case 301:
        showNotification({
          message: "Resource has been moved permanently.",
          type: "warning",
        });
        break;
      case 302:
        showNotification({
          message:
            "Resource has been found at a different location temporarily.",
          type: "warning",
        });
        break;
      case 304:
        showNotification({
          message: "Resource not modified. Using cached version.",
          type: "info",
        });
        break;

      // **4xx Client Errors**
      case 400:
        showNotification({
          message: message || "Bad request. Please check your input.",
          type: "error",
        });
        break;
      case 401:
        showNotification({
          message: message || "Unauthorized. Please log in.",
          type: "error",
        });
        break;
      case 403:
        showNotification({
          message: message || "Forbidden. You do not have access.",
          type: "error",
        });
        break;
      case 404:
        showNotification({
          message: message || "Resource not found.",
          type: "error",
        });
        break;
      case 405:
        showNotification({
          message: "Method not allowed on this resource.",
          type: "error",
        });
        break;
      case 408:
        showNotification({
          message: "Request timeout. Please try again.",
          type: "error",
        });
        break;
      case 409:
        showNotification({
          message: message || "Conflict occurred. Try again.",
          type: "error",
        });
        break;
      case 410:
        showNotification({
          message: "Resource is no longer available (Gone).",
          type: "warning",
        });
        break;
      case 422:
        showNotification({
          message: message || "Validation error. Check your input.",
          type: "error",
        });
        break;
      case 429:
        showNotification({
          message: "Too many requests. Please slow down.",
          type: "warning",
        });
        break;

      // **5xx Server Errors**
      case 500:
        showNotification({
          message: message || "Internal server error. Please try again later.",
          type: "error",
        });
        break;
      case 501:
        showNotification({
          message:
            "Not implemented. The server does not support this functionality.",
          type: "error",
        });
        break;
      case 502:
        showNotification({
          message: "Bad gateway. Invalid response from upstream server.",
          type: "error",
        });
        break;
      case 503:
        showNotification({
          message: "Service unavailable. Please try again later.",
          type: "error",
        });
        break;
      case 504:
        showNotification({
          message: "Gateway timeout. The server did not respond in time.",
          type: "error",
        });
        break;
      case 505:
        showNotification({
          message: "HTTP version not supported by the server.",
          type: "error",
        });
        break;

      // **Default Case**
      default:
        showNotification({
          message: `Unexpected status code: ${status}`,
          type: "warning",
        });
        break;
    }
  };

  return { handleResponse };
};

export default useHandleResponse;
