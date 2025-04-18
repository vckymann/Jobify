import * as React from "react";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import CircularProgress from "@mui/joy/CircularProgress";
import { useCountUp } from "use-count-up";

interface CircularProgressProps {
  matchScore: number;
  detailSection?: boolean
}

export default function CircularProgressCountUp({ matchScore,detailSection }: CircularProgressProps) {
  
  const { value } = useCountUp({
    isCounting: true,
    duration: 2,
    start: 0,
    end: matchScore,
  });
  
  const getColor = (score: number) => {
    if (score >= 80) return "rgb(59, 130, 246)"; 
    if (score >= 50) return "orange";
    return "red";
  };

  return (
    <Stack direction="row" spacing={8} sx={{ alignItems: "center", flexWrap: "wrap" }}>
      <Stack spacing={2}>
        <CircularProgress
          size={detailSection ? "lg" : "md"}
          determinate
          thickness={detailSection ? 5 : 3}
          variant="solid"
          color="neutral"
          value={Number(value)}
          sx={{ "--CircularProgress-progressColor": getColor(matchScore), }}
        >
          <Typography fontSize={detailSection ? "xl" : "14px"} textColor={getColor(matchScore)}>{value}%</Typography>
        </CircularProgress>
      </Stack>
    </Stack>
  );
}
