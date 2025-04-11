import React, { useState, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Typography,
  useTheme,
} from "@mui/material";
import YouTube, { YouTubeEvent, YouTubePlayer } from "react-youtube";

interface Lecture {
  _id: string;
  title: string;
  subject: string;
  className: string;
  chapter: string;
  topic: string;
  link: string;
  linkType: string;
  facultyName: string;
  lectureNumber: string;
}

interface YouTubeVideoPlayerProps {
  videoId: string;
  data: Lecture | null;
}

const PLAYER_STATES = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 5,
};

const YouTubeVideoPlayer: React.FC<YouTubeVideoPlayerProps> = ({
  videoId,
  data,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoTitle, setVideoTitle] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);

  const theme = useTheme();

  const handleStateChange = useCallback((event: YouTubeEvent<number>) => {
    setIsPlaying(event.data === PLAYER_STATES.PLAYING);
  }, []);

  const handleOnReady = useCallback((event: YouTubeEvent<YouTubePlayer>) => {
    const player = event.target;
    const title = player.getVideoData().title;
    const duration = player.getDuration();

    if (title) setVideoTitle(title);
    if (duration) setVideoDuration(duration);
  }, []);

  const formatDuration = (seconds: number | null) => {
    if (seconds === null) return "Unknown";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <Box sx={{ width: "100%", maxWidth: "800px", mx: "auto" }}>
      {/* Video Container */}
      <Box
        sx={{
          position: "relative",
          paddingTop: "56.25%", // 16:9 aspect ratio
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
              height: "450",
              playerVars: {
                autoplay: 0,
                controls: 1,
              },
            }}
          />
        </Box>
      </Box>

      {/* Video Details */}
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
