import React,{useState,useEffect} from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Paper,
  FormHelperText,
  Container,
  Typography
} from "@mui/material";
import NoDocuments from '../assets/NoDocuments.png';

import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const MainContent = () => {
  // Document list data
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sso_id = "2fc2411c-a0c9-404d-a13a-408241e81fe2"; //get it from local storage
  useEffect(() => {
    const fetchDocuments = async () => {
      // Retrieve the auth token from localStorage
    //   const authToken = localStorage.getItem("authToken"); // Replace with your actual key in localStorage

    //   if (!authToken) {
    //     setError("No authorization token found.");
    //     setLoading(false);
    //     return;
    //   }

      const apiUrl = `${import.meta.env.VITE_APP_API_URL}/user-docs/fetch/${sso_id}`;

      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            // "Authorization": `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch documents");
        }

        const data = await response.json();
        setDocuments(data);  // Assuming the response is an array of documents
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDocuments();  // Call the function when the component mounts
  }, []); 

  if (documents.length>0) {
    return (
      <Box sx={{ maxWidth: 600, mx: "auto", p: 0.5 }}>
        <Paper elevation={1} sx={{ bgcolor: "background.paper" }}>
          <List sx={{ width: "100%" }}>
            {documents.map((doc, index) => {
              // Parse the doc_data string to get the id
              const docData = JSON.parse(doc.doc_data);
              return (
                <ListItem
                  key={doc.doc_id}
                  disablePadding
                  sx={{
                    py: 1.5,
                    borderBottom: index !== documents.length - 1 ? "1px solid" : "none",
                    borderColor: "divider",
                    display: "flex",
                    alignItems: "flex-start",
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, p: 0.5 }}>
                    <CheckCircleIcon sx={{ color: "#00AB55", fontSize: 24 }} />
                  </ListItemIcon>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <ListItemText
                      primary={doc.doc_type}
                      primaryTypographyProps={{
                        sx: {
                          fontSize: "1rem",
                          fontWeight: 500,
                          color: "text.primary",
                          fontFamily: "Poppins, sans-serif",
                        },
                      }}
                    />
                    <FormHelperText sx={{ ml: 0.4, fontFamily: "Poppins, sans-serif" }}>
                      ID: {docData.id}
                    </FormHelperText>
                  </Box>
                </ListItem>
              );
            })}
          </List>
        </Paper>
      </Box>
    );
  }

  return (
    <Container
      maxWidth="sm"
      sx={{
        pt: 8,
        pb: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        flexGrow: 1,
      }}
    >
      <img
        src={NoDocuments}
        alt="No Documents"
        style={{ width: 260, height: 210 }}
      />
      <Typography variant="h5" gutterBottom sx={{ fontFamily: "Poppins, sans-serif" }}>
        <b>Bring Your Digital Identity</b>
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ fontFamily: "Poppins, sans-serif" }}>
        Tap on the "+" icon below to add your documents to this wallet
      </Typography>
    </Container>
  );
};

export default MainContent;
