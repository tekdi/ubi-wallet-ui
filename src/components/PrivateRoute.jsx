import { useLocation, useNavigate } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import { useEffect } from "react";

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();
  const { keycloak } = useKeycloak();
  const location = useLocation();
  const isLoggedIn = keycloak.authenticated;

  if (!isLoggedIn || localStorage.getItem('authToken') == undefined ) {
    localStorage.setItem("login-redirect", location.pathname);
    navigate("/"); 
  }

  return children; // Render the children if authenticated
};

export default PrivateRoute;
