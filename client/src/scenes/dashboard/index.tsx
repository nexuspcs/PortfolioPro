// Importing Box component and useTheme hook from Material-UI
import { Box, useTheme } from "@mui/material";

// Defining Props type as an empty object for Dashboard component
type Props = {};

// Defining a grid template as a string for the layout of the dashboard
const gridTemplate = `
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
`

// Dashboard functional component definition
const Dashboard = (props: Props) => {
  // Using the useTheme hook to access the theme object and destructuring to get the palette
  const { palette } = useTheme();
  // Returning a Box component styled as a grid to represent the dashboard layout
  return (
    <Box width="100%" height="100%" display="grid" gap="1.5rem"
    sx={{
        // Setting the grid's columns to repeat 3 times with a minimum width and flexible growth
        gridTemplateColumns: "repeat(3, minmax(370px, 1fr))",
        // Applying the grid template areas defined above to layout the grid items
        gridTemplateAreas: gridTemplate,
    }}
    >
      Dashboard
    </Box>
  );
};

export default Dashboard;