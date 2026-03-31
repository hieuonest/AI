import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Login from "../page/login";
import Home from "../page/PPTXChecker";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
