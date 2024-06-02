import { Box } from "@mui/material";
import { styled } from "@mui/system"; // Add the missing import statement

const FlexBetween = styled(Box)({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
})

export default FlexBetween;