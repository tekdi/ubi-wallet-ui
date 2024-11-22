import { useLocation, useNavigate } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";

const PrivateRoute = ({ children }) => {
  // const isLoggedIn = localStorage.getItem("authToken");
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
