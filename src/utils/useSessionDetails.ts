import { useEffect, useState } from "react";
import { UAParser } from "ua-parser-js";
import axios from "axios";
import { LS_KEYS } from "../constant/constants";
import { v4 as uuid } from "uuid";

export interface SessionDetails {
  deviceId: string;
  platform: string; // Operating system (e.g., Windows, macOS)
  platformVersion: string; // OS version
  browser: string; // Browser name (e.g., Chrome, Firefox)
  browserVersion: string; // Browser version
  deviceType: string; // Device type (e.g., mobile, tablet, desktop)
  isMobile: boolean; // Whether the device is a mobile device
  ip: string; // User's public IP address
}

const useSessionDetails = () => {
  const [sessionDetails, setSessionDetails] = useState<SessionDetails | null>(
    null
  );

  useEffect(() => {
    const fetchSessionDetails = async () => {
      const deviceId = getDeviceId();
      const ip = await fetchIp();
      const {
        platform,
        platformVersion,
        browser,
        browserVersion,
        deviceType,
        isMobile,
      } = getDeviceDetails();

      setSessionDetails({
        deviceId,
        platform,
        platformVersion,
        browser,
        browserVersion,
        deviceType,
        isMobile,
        ip,
      });
    };

    fetchSessionDetails();
  }, []);

  const getDeviceId = () => {
    let deviceId = localStorage.getItem(LS_KEYS.DEVICE_ID);
    if (!deviceId) {
      deviceId = uuid(); // Get the machine's unique device ID
      localStorage.setItem(LS_KEYS.DEVICE_ID, deviceId);
    }
    return deviceId;
  };

  const getDeviceDetails = () => {
    const parser = new UAParser();
    const result = parser.getResult();
    return {
      platform: result.os.name || "unknown",
      platformVersion: result.os.version || "unknown",
      browser: result.browser.name || "unknown",
      browserVersion: result.browser.version || "unknown",
      deviceType: result.device.type || "desktop", // Default to "desktop" if no type is detected
      isMobile: result.device.type === "mobile" || false,
    };
  };

  const fetchIp = async (): Promise<string> => {
    try {
      const response = await axios.get("https://api64.ipify.org?format=json");
      return response.data.ip;
    } catch (err) {
      console.error("Failed to fetch IP:", err);
      return "unknown";
    }
  };

  return sessionDetails;
};

export default useSessionDetails;
