import React, { useState } from "react";
import {
  Container,
  Box,
  IconButton,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  FormHelperText,
  FormControl,
  InputLabel,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DownloadIcon from "@mui/icons-material/Download";
import ShareConfirmationDialog from "./ShareConfirmationDialog";
import { Info } from "lucide-react";
import { documentTypes } from "../config";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import BottomNavigationBar from "./BottomNavigationBar";

const Fetch = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [docId, setDocId] = useState("");
  const [errors, setErrors] = useState({ documentType: "", docId: "" });

  // Handle document selection
  const handleDocumentChange = (e) => {
    const selected = e.target.value;
    const selectedDoc = documentTypes.find((doc) => doc.value === selected);
    setSelectedDocument(selectedDoc);
  };

  const handleFetch = () => {
    let formErrors = { documentType: "", docId: "" };

    // Validate document type and document ID
    if (!selectedDocument) {
      formErrors.documentType = "Document type is required.";
    }

    if (!docId) {
      formErrors.docId = "Document ID is required.";
    }

    setErrors(formErrors);

    // Proceed only if no errors
    if (!formErrors.documentType && !formErrors.docId) {
      setOpen(true); // Open the confirmation dialog
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />

      <Container sx={{ flexGrow: 1 }}>
        <Box sx={{ mt: 2, mb: 4 }}>
          <IconButton onClick={() => navigate("/home")}>
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="span"
            sx={{ ml: 2, fontFamily: "Poppins, sans-serif" }}
          >
            Fetch New Document
          </Typography>
        </Box>

        {/* Select Document Type */}
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontFamily: "Poppins, sans-serif" }}
        >
          Select Document Type
        </Typography>

        <FormControl fullWidth sx={{ my: 2 }} error={Boolean(errors.documentType)}>
          <InputLabel sx={{ fontFamily: "Poppins, sans-serif" }}>
            Select Document Type
          </InputLabel>
          <Select
            value={selectedDocument?.value || ""}
            onChange={handleDocumentChange}
            label="Select Document Type"
            sx={{ fontFamily: "Poppins, sans-serif" }}
          >
            {documentTypes.map((doc) => (
              <MenuItem key={doc.value} value={doc.value}>
                {doc.label}
              </MenuItem>
            ))}
          </Select>
          {errors.documentType && (
            <FormHelperText>{errors.documentType}</FormHelperText>
          )}
        </FormControl>

        {/* Document ID Input */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle2"
            gutterBottom
            sx={{ fontFamily: "Poppins, sans-serif" }}
          >
            Document ID
          </Typography>
          <TextField
            fullWidth
            placeholder="Paste Here"
            value={docId}
            onChange={(e) => setDocId(e.target.value)}
            error={Boolean(errors.docId)}
            helperText={
              errors.docId && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  <Info />
                  <FormHelperText sx={{ ml: 0.4 }}>
                    Hint Text: Where this ID can be found
                  </FormHelperText>
                </Box>
              )
            }
          />
        </Box>

        {/* Fetch Button */}
        <Button
          variant="contained"
          fullWidth
          startIcon={<DownloadIcon />}
          onClick={handleFetch} // Trigger fetch only if valid
          sx={{ borderRadius: 7 }}
        >
          Fetch
        </Button>

        {/* ShareConfirmationDialog with necessary props */}
        <ShareConfirmationDialog
          open={open}
          onClose={() => setOpen(false)}
          documentType={selectedDocument?.doc_type}  // Passing the document type
          documentSubType={selectedDocument?.doc_subtype} // Passing the document subtype
          documentName={selectedDocument?.value}  // Passing the document name
          docId={docId}  // Passing the document ID
        />
      </Container>

      <BottomNavigationBar />
    </Box>
  );
};

export default Fetch;
