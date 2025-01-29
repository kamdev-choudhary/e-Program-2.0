import React, { useState, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Typography,
  useTheme,
} from "@mui/material";
import YouTube from "react-youtube";

interface YouTubeVideoPlayerProps {
  videoId: string;
  data?: { subject?: string };
}

const YouTubeVideoPlayer: React.FC<YouTubeVideoPlayerProps> = ({
  videoId,
  data,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoTitle, setVideoTitle] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);

  const theme = useTheme();

  const PLAYER_STATES = {
    UNSTARTED: -1,
    ENDED: 0,
    PLAYING: 1,
    PAUSED: 2,
    BUFFERING: 3,
    CUED: 5,
  };

  const handleStateChange = useCallback((event: any) => {
    setIsPlaying(event.data === PLAYER_STATES.PLAYING);
  }, []);

  const handleOnReady = useCallback((event: any) => {
    const player = event.target;
    setVideoTitle(player.getVideoData().title);
    setVideoDuration(player.getDuration());
  }, []);

  const formatDuration = (seconds: number | null) => {
    if (seconds === null) return "";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <Box sx={{ width: "100%", maxWidth: "800px", mx: "auto" }}>
      {/* Video Container with Aspect Ratio (16:9) */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          pt: "56.25%", // 16:9 Aspect Ratio
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: theme.shadows[3],
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <YouTube
            videoId={videoId}
            onStateChange={handleStateChange}
            onReady={handleOnReady}
            opts={{
              width: "100%",
              height: "100%",
              playerVars: {
                autoplay: 0,
                controls: 1,
              },
            }}
          />
        </Box>
      </Box>

      {/* Video Details Card */}
      <Card sx={{ mt: 2, p: 2 }}>
        <CardContent>
          <Typography variant="h6">{videoTitle || "Loading..."}</Typography>
          <Divider sx={{ my: 1 }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Typography variant="body1">
              Duration: {formatDuration(videoDuration)}
            </Typography>
            <Typography variant="body1">
              Status: {isPlaying ? "Playing" : "Paused"}
            </Typography>
            {data?.subject && (
              <Typography variant="body1">Subject: {data.subject}</Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default YouTubeVideoPlayer;
