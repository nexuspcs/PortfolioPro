import { Box } from "@mui/material";
import { CssBaseline, ThemeProvider } from "@mui/material/";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { BrowserRouter } from "react-router-dom";
import { themeSettings } from "./theme";
import Navbar from "@/scenes/navbar";


function App() { 
  const theme = useMemo(() => createTheme(themeSettings), [])
  return (
    <div className="App">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box width="100%" height="100%" padding="1rem 2rem 4rem 2rem">
<<<<<<< HEAD
            <Navbar />
            <Routes>
              <Route path="/" element={<div>Dashboard Page</div>} />
              <Route path="/predictions" element={<div>Predictions Page</div>} />
            </Routes>
=======

>>>>>>> parent of b8a6413 (Creating routes which are essentilly an easy way to use a premade navbar)
          </Box>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;

