import { CssBaseline, ThemeProvider } from "@mui/material/";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { BrowserRouter } from "react-router-dom";
import { themeSettings } from "./theme";


function App() { 
  const theme = useMemo(() => createTheme(themeSettings), [])
  return (
    <div className="App">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          hello world
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;

