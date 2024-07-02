/* eslint-disable react/prop-types */
import { useContext } from "react";
import { authContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ children }) => {
  const { token } = useContext(authContext);

  const accessibleRoute = token != null ? (
    children
  ) : (
    <Navigate to="/login" replace={true} />
  );

  return accessibleRoute;
};
export default ProtectedRoutes;
