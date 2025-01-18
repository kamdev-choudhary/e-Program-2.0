import React from "react";

interface Youtube {
  url: string;
}

const YouTubeVideoPlayer: React.FC<Youtube> = ({ url }) => {
  return (
    <div style={{ position: "relative", width: "100%", paddingTop: "56.25%" }}>
      <iframe
        src={url}
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          borderRadius: "10px",
        }}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export default YouTubeVideoPlayer;
