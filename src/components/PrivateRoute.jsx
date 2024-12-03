import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      // Save the current location for redirecting after login
      localStorage.setItem("login-redirect", location.pathname);
      navigate("/"); // Redirect to login page
    }
  }, [navigate, location]);

  return <>{children}</>; // Render children if authenticated
};

export default PrivateRoute;
