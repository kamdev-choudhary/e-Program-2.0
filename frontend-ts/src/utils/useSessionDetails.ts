import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { UAParser } from "ua-parser-js";
import axios from "axios";

export interface SessionDetails {
  deviceId: string;
  platform: string;
  browser: string;
  ip: string;
}

const useSessionDetails = () => {
  const [sessionDetails, setSessionDetails] = useState<SessionDetails | null>(
    null
  );

  useEffect(() => {
    const fetchSessionDetails = async () => {
      const deviceId = getDeviceId();
      const ip = await fetchIp();
      const { platform, browser } = getDeviceDetails();

      setSessionDetails({
        deviceId,
        platform,
        browser,
        ip,
      });
    };

    fetchSessionDetails();
  }, []);

  const getDeviceId = () => {
    let deviceId = localStorage.getItem("deviceId");
    if (!deviceId) {
      deviceId = uuidv4();
      localStorage.setItem("deviceId", deviceId);
    }
    return deviceId;
  };

  const getDeviceDetails = () => {
    const parser = UAParser(); // No `new` required, just call it as a function
    console.log(parser);
    return {
      platform: parser.os.name || "unknown",
      browser: parser.browser.name || "unknown",
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
