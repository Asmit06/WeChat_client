/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectRoute = ({ children, user, redirect = "/login" }) => {
  if (!user) return <Navigate to={redirect} />;

  return children ? children : <Outlet />;
};

