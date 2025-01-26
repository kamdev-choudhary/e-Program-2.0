import {
  Box,
  Card,
  CardContent,
  Divider,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import YouTube from "react-youtube";

interface YouTubeVideoPlayerProps {
  videoId: string;
  data?: any;
}

const YouTubeVideoPlayer: React.FC<YouTubeVideoPlayerProps> = ({
  videoId,
  data,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoTitle, setVideoTitle] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const PLAYER_STATES = {
    UNSTARTED: -1,
    ENDED: 0,
    PLAYING: 1,
    PAUSED: 2,
    BUFFERING: 3,
    CUED: 5,
  };

  const handleStateChange = (event: any) => {
    const playerState = event.data;
    setIsPlaying(playerState === PLAYER_STATES.PLAYING);
  };

  const handleOnReady = (event: any) => {
    const player = event.target;

    const title = player.getVideoData().title;
    const duration = player.getDuration();

    setVideoTitle(title);
    setVideoDuration(duration);
  };

  const formatDuration = (seconds: number | null) => {
    if (seconds === null) return "";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <Box>
      <Box
        sx={{
          width: "100%",
          height: isSmallScreen ? "200px" : "390px",
          borderRadius: "12px", // Rounded corners
          overflow: "hidden", // Ensures rounded corners are applied to iframe
        }}
      >
        <YouTube
          videoId={videoId}
          onStateChange={handleStateChange}
          onReady={handleOnReady}
          opts={{
            width: "100%",
            height: isSmallScreen ? "200" : "390",
            playerVars: {
              autoplay: 0,
              controls: 1,
            },
          }}
        />
      </Box>
      <Card sx={{ mt: 1, p: 2, pb: 0 }}>
        <CardContent sx={{ m: 0, p: 0 }}>
          <Typography variant="h6">{videoTitle || "Loading..."}</Typography>
          <Divider />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 1,
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <Typography variant="body1">
              Duration: {formatDuration(videoDuration)}
            </Typography>
            <Typography variant="body1">
              Status: {isPlaying ? "Playing" : "Paused"}
            </Typography>
            {data?.subject && (
              <Typography variant="body1">Subject : {data.subject}</Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default YouTubeVideoPlayer;
