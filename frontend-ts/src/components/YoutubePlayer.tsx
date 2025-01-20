import { Box, Card, CardContent, Typography } from "@mui/material";
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

  // YouTube player state constants
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
    if (playerState === PLAYER_STATES.PLAYING) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  const handleOnReady = (event: any) => {
    const player = event.target;

    // Fetch video details
    const title = player.getVideoData().title; // Get video title
    const duration = player.getDuration(); // Get video duration in seconds

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
      <YouTube
        videoId={videoId}
        onStateChange={handleStateChange}
        onReady={handleOnReady}
        opts={{
          width: "100%",
          height: "390",
          playerVars: {
            autoplay: 0,
            controls: 1,
          },
        }}
      />
      <Card sx={{ mt: 1, p: 2, pb: 0 }}>
        <CardContent sx={{ m: 0, p: 0 }}>
          <Typography variant="h6">{videoTitle || "Loading..."}</Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2">
              Duration: {formatDuration(videoDuration)}
            </Typography>
            <Typography variant="body2">
              Status: {isPlaying ? "Playing" : "Paused"}
            </Typography>
          </Box>
          {data?.subject && <Typography>Subject : {data.subject}</Typography>}
        </CardContent>
      </Card>
    </Box>
  );
};

export default YouTubeVideoPlayer;
