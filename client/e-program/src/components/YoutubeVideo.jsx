import React from "react";

const YouTubeVideo = ({ videoId, width, height }) => {
  return (
    <div style={{ width: width, height: height }}>
      <iframe
        width="100%"
        height="325rem"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default YouTubeVideo;
