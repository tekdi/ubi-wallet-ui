import { useState, useEffect } from "react";
import {
  List,
  ListItem,
  Box,
  Paper,
  FormHelperText,
  Container,
  Typography,
  Tooltip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
} from "@mui/material";
import NoDocuments from "../assets/NoDocuments.png";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import FloatingActionButton from "./FloatingActionButton";
import axios from "axios";

const MainContent = () => {
  // Document list data
  const [documents, setDocuments] = useState([]);

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [open, setOpen] = useState(false);
  const [documentName, setDocumentName] = useState();
  const fetchDocuments = async () => {
    // Retrieve the auth token from localStorage
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      setError("No authorization token found.");
      return;
    }

    const apiUrl = `${import.meta.env.VITE_APP_API_URL}/user-docs/fetch`;

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch documents");
      }

      const data = await response.json();

      setDocuments(data);
    } catch (err) {
      setError(err.message);
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = (doc) => {
    setDocumentName(doc);
    setOpen(true);
  };
  const handleDelete = async () => {
    const authToken = localStorage.getItem("authToken");
    console.log(" document?.doc_id", documentName?.doc_id);

    try {
      const url = `${import.meta.env.VITE_APP_API_URL}/user-docs/delete/${
        documentName?.doc_id
      }`;
      const headers = {
        Authorization: `Bearer ${authToken}`,
      };

      const response = await axios.delete(url, { headers });
      handleClose();
      setSuccess(true);
      setTimeout(() => {
        setSuccess(null);
      }, 5000);
      fetchDocuments();

      return response.data;
    } catch (error) {
      handleClose();
      setError(error.errorMessage);
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };
  if (documents.length > 0) {
    return (
      <Box sx={{ maxWidth: 600, mx: "auto" }}>
        <Paper elevation={1}>
          <List sx={{ width: "100%" }}>
            {documents.map((doc, index) => {
              // Parse the doc_data string to get the id
              // const docData = JSON.parse(doc.doc_data);
              return (
                <ListItem
                  key={doc.doc_id}
                  disablePadding
                  sx={{
                    py: 1.5,
                    borderBottom:
                      index !== documents.length - 1 ? "1px solid" : "none",
                    borderColor: "#DDDDDD",
                    display: "flex",
                    alignItems: "flex-start",
                    width: "100%",
                  }}
                >
                  <Box sx={{ minWidth: 40, mt: "5px", p: 0.5 }}>
                    <CheckCircleIcon sx={{ color: "#00AB55", fontSize: 24 }} />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                    }}
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      width={"100%"}
                    >
                      {/* Document Text */}
                      <Typography
                        sx={{
                          fontSize: "1rem",
                          fontWeight: 500,
                          color: "text.primary",
                          fontFamily: "Poppins, sans-serif",
                        }}
                      >
                        {doc.doc_name}
                      </Typography>

                      {/* Tooltip with Delete Icon */}
                      <Tooltip title="Delete">
                        <IconButton
                          color="grey"
                          aria-label="delete"
                          size="medium"
                          onClick={() => handleOpen(doc)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <FormHelperText
                      sx={{ ml: 0.4, fontFamily: "Poppins, sans-serif" }}
                    >
                      ID: {doc.doc_id}
                    </FormHelperText>
                  </Box>
                </ListItem>
              );
            })}
          </List>
        </Paper>
        <FloatingActionButton />

        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete the document{" "}
              <strong>{documentName?.doc_name}</strong>? This action cannot be
              undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleDelete} autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        {error && (
          <Alert severity="error">This is an error Alert.{error}</Alert>
        )}
        {success && (
          <Alert severity="success">Document deleted successfully</Alert>
        )}
      </Box>
    );
  }

  return (
    <Container
      maxWidth="sm"
      sx={{
        pt: 8,
        pb: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        flexGrow: 1,
      }}
    >
      <img
        src={NoDocuments}
        alt="No Documents"
        style={{ width: 260, height: 210 }}
      />
      <Typography
        variant="h5"
        gutterBottom
        sx={{ fontFamily: "Poppins, sans-serif" }}
      >
        <b>Bring Your Digital Identity</b>
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ fontFamily: "Poppins, sans-serif" }}
      >
        Tap on the "+" icon below to add your documents to this wallet
      </Typography>
    </Container>
  );
};

export default MainContent;
