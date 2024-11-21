import { useLocation, useNavigate } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import { useEffect } from "react";

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();
  const { keycloak } = useKeycloak();
  const location = useLocation();
  const isLoggedIn = keycloak.authenticated;

  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.setItem("login-redirect", location.pathname); // Store the current location to redirect after login
      navigate("/"); // Redirect to the login page
    }
  }, [isLoggedIn, location.pathname, navigate]); // The effect depends on isLoggedIn, location.pathname, and navigate

  return children; // Render the children if authenticated
};

export default PrivateRoute;
