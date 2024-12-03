import { createRoot } from "react-dom/client";
import React from 'react';
import "./index.css";
import App from "./App.jsx";
// import keycloak from "./keycloak";
// import { ReactKeycloakProvider } from "@react-keycloak/web";

createRoot(document.getElementById("root")).render(
  // <ReactKeycloakProvider authClient={keycloak}>
  //     <App />
  // </ReactKeycloakProvider>
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
