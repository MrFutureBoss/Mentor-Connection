import { useEffect } from "react";

import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import { ThemeProvider } from "@mui/material/styles";

import theme from "assets/theme";
import Presentation from "layouts/pages/presentation";
import routes from "routes";
import "./App.css";
import GroupDetail from "layouts/user/students/index";
import { ToastContainer } from "react-toastify";
import { CssBaseline } from "@mui/material";
import TeachersFunction from "layouts/sections/featuers";
import SignInPage from "layouts/pages/authentication/sign-in";
import Author from "pages/LandingPages/Author";

export default function App() {
  const { pathname } = useLocation();
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);
  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }
      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }
      return null;
    });

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer />
      <CssBaseline />
      <Routes>
        {getRoutes(routes())}
        <Route path="/group/:groupId/members" element={<GroupDetail />} />
        <Route path="/user/:userId/profile" element={<Author />} />
        <Route path="/presentation/class/:classId" element={<TeachersFunction />} />
        <Route path="/presentation/auth/sign-in" element={<SignInPage />} />
        <Route path="/presentation" element={<Presentation />} />
        <Route path="*" element={<Navigate to={"/presentation"} />} />
      </Routes>
    </ThemeProvider>
  );
}
