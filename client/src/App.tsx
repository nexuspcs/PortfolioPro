import { CssBaseline, ThemeProvider } from "@mui/material/";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { themeSettings } from "./theme";

function App() { 
  const theme = useMemo(() => createTheme(themeSettings), [])
  return <div className="App"></div>;
    <ThemeProvider theme={theme}>
      <CssBaseline />
    </ThemeProvider>
}

export default App;

