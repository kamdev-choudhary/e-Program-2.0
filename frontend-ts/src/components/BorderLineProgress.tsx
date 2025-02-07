import { styled } from "@mui/material/styles";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";

const StyledBorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[200],
    ...theme.applyStyles("dark", {
      backgroundColor: theme.palette.grey[800],
    }),
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: "#1a90ff",
    ...theme.applyStyles("dark", {
      backgroundColor: "#0e8147",
    }),
  },
}));

interface BorderLinearProgressProps {
  value: number;
}

const BorderLinearProgress: React.FC<BorderLinearProgressProps> = ({
  value,
}) => {
  return <StyledBorderLinearProgress variant="determinate" value={value} />;
};

export default BorderLinearProgress;
