// Importing Box component and useTheme hook from Material-UI
import { Box, useMediaQuery, useTheme } from "@mui/material";

// Defining Props type as an empty object for Dashboard component
type Props = {};

// Defining a grid template as a string for the layout of the dashboard
const gridTemplateLargeScreens = `
    "a b c"
    "a b c"
    "a b c"
    "a b f"
    "d e f"
    "d e f"
    "d h i"
    "g h i"
    "g h j"
    "g h j"
`;
const gridTemplateSmallScreens = `
    "a"
    "a"
    "a"
    "a"
    "b"
    "b"
    "b"
    "c"
    "c"
    "c"
    "d"
    "d"
    "d"
    "e"
    "e"
    "f"
    "f"
    "f"
    "g"
    "g"
    "g"
    "h"
    "h"
    "h"
    "h"
    "i"
    "i"
    "j"
    "j"
`;

// Dashboard functional component definition
const Dashboard = (props: Props) => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 1200px)");
  // Using the useTheme hook to access the theme object and destructuring to get the palette
  const { palette } = useTheme();
  // Returning a Box component styled as a grid to represent the dashboard layout
  return (
    <Box
      width="100%"
      height="100%"
      display="grid"
      gap="1.5rem"
      sx={
        isAboveMediumScreens
          ? {
              gridTemplateColumns: "repeat(3, minmax(370px, 1fr))",
              gridTemplateRows: "repeat(10, minmax(60px, 1fr))",
              gridTemplateAreas: gridTemplateLargeScreens,
            }
          : {
              gridAutoColumns: "1fr",
              gridAutoRows: "80px",
              gridTemplateAreas: gridTemplateSmallScreens,
            }
      }
    >
      <Box bgcolor="#fff" gridArea="a"></Box>
      <Box bgcolor="#fff" gridArea="b"></Box>
      <Box bgcolor="#fff" gridArea="c"></Box>
      <Box bgcolor="#fff" gridArea="d"></Box>
      <Box bgcolor="#fff" gridArea="e"></Box>
      <Box bgcolor="#fff" gridArea="f"></Box>
      <Box bgcolor="#fff" gridArea="g"></Box>
      <Box bgcolor="#fff" gridArea="h"></Box>
      <Box bgcolor="#fff" gridArea="i"></Box>
      <Box bgcolor="#fff" gridArea="j"></Box>
    </Box>
  );
};

export default Dashboard;
