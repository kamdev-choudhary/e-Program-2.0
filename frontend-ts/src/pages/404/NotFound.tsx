import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <Box
      sx={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        height: "80vh",
        overflow: "hidden", // Prevent animations from overflowing the Box
      }}
    >
      {/* Full-Screen Floating Icons */}
      {[...Array(20)].map((_, index) => (
        <motion.img
          key={index}
          src={`/images/lightbulb-icon.png`} // Replace with your image path
          alt="Floating Education Icon"
          initial={{
            x: `${Math.random() * 100}vw`,
            y: `${Math.random() * 100}vh`,
            opacity: 0.6,
            scale: Math.random() * 0.5 + 0.5, // Random sizes
          }}
          animate={{
            x: [`${Math.random() * 100}vw`, `${Math.random() * 100}vw`],
            y: [`${Math.random() * 100}vh`, `${Math.random() * 100}vh`],
            rotate: [0, 360],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 10 + Math.random() * 5, // Varying speeds
            repeat: Infinity,
            repeatType: "loop",
          }}
          style={{
            position: "absolute",
            width: `${30 + Math.random() * 70}px`, // Random widths
          }}
        />
      ))}

      {/* 404 Title */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        <Typography
          variant="h1"
          color="error"
          sx={{
            fontWeight: "bold",
            fontSize: "8rem",
            letterSpacing: "0.2rem",
          }}
        >
          404
        </Typography>
      </motion.div>

      {/* Subheading with Pulsating Effect */}
      <motion.div
        animate={{
          opacity: [1, 0.6, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      >
        <Typography
          variant="h5"
          color="text.secondary"
          gutterBottom
          sx={{ marginBottom: 3 }}
        >
          Oops! The page you're looking for doesn't exist.
        </Typography>
      </motion.div>

      {/* Button with Hover Effect */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleGoBack}
          sx={{
            paddingX: 4,
            paddingY: 1.5,
            fontWeight: "bold",
          }}
        >
          Go to Homepage
        </Button>
      </motion.div>
    </Box>
  );
};

export default NotFound;
