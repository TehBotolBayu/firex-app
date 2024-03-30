import React, {useState, useEffect,createContext} from "react";
import {BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import {Admin} from "./layouts/admin";
import AuthLayout from "./views/auth/SignIn";
// import { is } from "core-js/core/object";



const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="auth/*" element={<AuthLayout />} />
      <Route path="admin/*" element={<Admin />} />
      <Route path="/" element={<Navigate to="/admin" replace />} />
    </Routes>
    </BrowserRouter>
  );
};
export default App;