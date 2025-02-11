import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

const GameModal = ({ isOpen, onClose, modalContent }) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "rgba(30, 30, 50, 0.95)", // Dark futuristic background
          border: "2px solid #5A5AF6", // Neon border
          boxShadow: 24,
          borderRadius: "16px",
          p: 4,
          textAlign: "center",
          width: 350,
          backdropFilter: "blur(10px)", // Glassmorphism effect
        }}
      >
        {/* Title */}
        <Typography
          variant="h4"
          sx={{
            color: "#FFAA00", // Gold text
            fontWeight: "bold",
            textTransform: "uppercase",
            letterSpacing: 2,
            mb: 2,
            textShadow: "0px 0px 10px rgba(255,170,0,0.7)",
          }}
        >
          {modalContent.name}
        </Typography>

        {/* Type */}
        <Typography
          variant="h6"
          sx={{
            color: "#F8F8F8",
            fontWeight: "bold",
            textShadow: "0px 0px 5px rgba(255,255,255,0.5)",
          }}
        >
          Type: {modalContent.type}
        </Typography>

        {/* Infrastructure */}
        <Typography
          variant="h6"
          sx={{
            color: "#AAA",
            fontSize: "18px",
            mt: 1,
          }}
        >
          Infrastructure: {modalContent.infrastructure}
        </Typography>

        {/* OK Button */}
        <Button
          onClick={onClose}
          sx={{
            mt: 3,
            background: "linear-gradient(45deg, #FFCC00, #FF6600)",
            color: "#FFF",
            fontWeight: "bold",
            px: 4,
            py: 1,
            borderRadius: "10px",
            fontSize: "18px",
            textShadow: "0px 0px 5px rgba(255,255,255,0.5)",
            "&:hover": {
              background: "linear-gradient(45deg, #FF9900, #FF3300)",
              boxShadow: "0px 0px 15px rgba(255,102,0,0.8)",
            },
          }}
        >
          OK
        </Button>
      </Box>
    </Modal>
  );
};

export default GameModal;
