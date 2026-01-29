import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import HomePage from "scenes/homePage";
import LoginPage from "scenes/loginPage";
import ProfilePage from "scenes/profilePage";
import Search from "scenes/search";
import ApointmentPage from "scenes/Appointment";
import CalendarPage from "scenes/Calendar";
import Encuesta from "scenes/Encuesta/Encuesta";

import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";


function App() {
  const mode = useSelector((state)=> state.mode);
  const theme = useMemo(()=> createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));

  return (
    <div className="app">
    <BrowserRouter>
    <ThemeProvider theme={theme}>
    <CssBaseline/>
    <Routes>
      <Route path="/" element={<LoginPage/>}/>
      <Route path="/home"  element={isAuth ? <HomePage /> : <Navigate to="/" />}/>
      <Route path="/Profile/:userId" element={isAuth ? <ProfilePage /> : <Navigate to="/" />}/>
      <Route path="/search"  element={isAuth ? <Search /> : <Navigate to="/" />}/>
      <Route path="/appointments"  element={isAuth ? <ApointmentPage /> : <Navigate to="/" />}/>
      <Route path="/calendar"  element={isAuth ? <CalendarPage /> : <Navigate to="/" />}/>
      <Route path="/encuesta"  element={isAuth ? <Encuesta /> : <Navigate to="/" />}/>

      

    </Routes>
    </ThemeProvider>
    </BrowserRouter>
    </div>
  );
}

export default App;
