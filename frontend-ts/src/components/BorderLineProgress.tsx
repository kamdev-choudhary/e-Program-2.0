import { styled } from "@mui/material/styles";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";

const StyledBorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 12,
  borderRadius: 6,
  overflow: "hidden",
  backgroundColor:
    theme.palette.mode === "dark"
      ? theme.palette.grey[800]
      : theme.palette.grey[300],
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 6,
    transition: "width 0.4s ease-in-out",
    background: `linear-gradient(to right, #06b6d4, #3b82f6)`, // Cyan to Blue gradient
  },
}));

interface BorderLinearProgressProps {
  value: number;
}

const BorderLinearProgress: React.FC<BorderLinearProgressProps> = ({
  value,
}) => {
  return (
    <StyledBorderLinearProgress
      variant="determinate"
      value={value}
      sx={{
        "& .MuiLinearProgress-bar": {
          background:
            value < 30
              ? "linear-gradient(to right, #ef4444, #f97316)" // Red to Orange for low values
              : value < 70
              ? "linear-gradient(to right, #facc15, #84cc16)" // Yellow to Green for mid values
              : "linear-gradient(to right, #06b6d4, #3b82f6)", // Cyan to Blue for high values
        },
      }}
    />
  );
};

export default BorderLinearProgress;
