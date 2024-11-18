import React, { useState } from "react";
import {
  Container,
  Box,
  IconButton,
  Typography,
  Select,
  MenuItem,
  Button,
  Input,
  FormHelperText,
  FormControl,
  InputLabel,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import ShareConfirmationDialog from "./ShareConfirmationDialog";
import { documentTypes } from "../config"; // Assuming document types are imported from config
import Header from "./Header";
import BottomNavigationBar from "./BottomNavigationBar";
import { useNavigate } from "react-router-dom";

const Upload = ({ documentType, onDocumentTypeChange, onBack }) => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null); // State to store the selected file
  const [selectedDocument, setSelectedDocument] = useState(documentType || ""); // State to store the selected document type
  const [errors, setErrors] = useState({ file: "", documentType: "" }); // Error state for validation
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === "application/json") {
        setFile(selectedFile); // Set the file if JSON
        setErrors((prevErrors) => ({ ...prevErrors, file: "" })); // Clear file error
      } else {
        setFile(null); // Clear the file state if not JSON
        setErrors((prevErrors) => ({
          ...prevErrors,
          file: "Please upload a valid JSON file.",
        }));
      }
    }
  };

  const handleUpload = () => {
    // Validation
    let formErrors = { file: "", documentType: "" };

    if (!selectedDocument) {
      formErrors.documentType = "Document type is required.";
    }

    if (!file) {
      formErrors.file = "File is required.";
    }

    setErrors(formErrors); // Update errors state

    // Show confirmation dialog if no errors
    if (!formErrors.documentType && !formErrors.file) {
      setOpen(true);
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
            Upload New Document
          </Typography>
        </Box>

        {/* Document Type Select */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle2"
            gutterBottom
            sx={{ fontFamily: "Poppins, sans-serif" }}
          >
            Select Document Type
          </Typography>

          <FormControl
            fullWidth
            error={Boolean(errors.documentType)}
            sx={{ my: 2 }}
          >
            {/* InputLabel with a labelId */}
            <InputLabel id="document-type-label">
              Select Document Type
            </InputLabel>
            <Select
              labelId="document-type-label" // Link the label to the Select
              fullWidth
              value={selectedDocument}
              onChange={(e) => setSelectedDocument(e.target.value)} // Set the selected document type
              label="Select Document Type" // This ensures the label works when an option is selected
            >
              {documentTypes.map((doc) => (
                <MenuItem key={doc.value} value={doc.value}>
                  {doc.label}
                </MenuItem>
              ))}
            </Select>

            {/* Display the error message if there's an error */}
            {errors.documentType && (
              <FormHelperText sx={{ fontFamily: "Poppins, sans-serif" }}>
                {errors.documentType}
              </FormHelperText>
            )}
          </FormControl>
        </Box>

        {/* File Upload Section */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle2"
            gutterBottom
            sx={{ fontFamily: "Poppins, sans-serif" }}
          >
            Select a File to Upload (JSON Only)
          </Typography>

          {/* Hidden file input with accept attribute for JSON files */}
          <Input
            type="file"
            onChange={handleFileChange}
            fullWidth
            sx={{ display: "none" }} // Hide the input
            id="upload-file-input"
            accept=".json"
          />

          {/* Button that triggers the file input */}
          <Button
            variant="outlined"
            fullWidth
            startIcon={<UploadFileIcon />}
            sx={{ mb: 2, fontFamily: "Poppins, sans-serif" }}
            onClick={() => document.getElementById("upload-file-input").click()} // Trigger file input click
          >
            Upload File
          </Button>

          {file && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontFamily: "Poppins, sans-serif" }}
            >
              Selected file: {file.name}
            </Typography>
          )}

          {/* Display error for file if any */}
          {errors.file && (
            <Typography
              variant="body2"
              color="error"
              sx={{ fontFamily: "Poppins, sans-serif" }}
            >
              {errors.file}
            </Typography>
          )}
        </Box>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontFamily: "Poppins, sans-serif" }}
        >
          Ensure that the file is in JSON format.
        </Typography>

        {/* Upload Button - Always enabled but will show errors if necessary */}
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 4, fontFamily: "Poppins, sans-serif", borderRadius: 7 }}
          startIcon={<UploadFileIcon />}
          onClick={handleUpload} // Trigger upload on button click
        >
          Upload
        </Button>

        {/* Confirmation Dialog */}
        <ShareConfirmationDialog
          open={open}
          onClose={() => setOpen(false)}
          documentType={selectedDocument} // Pass the selected document type to the dialog
        />
      </Container>

      <BottomNavigationBar />
    </Box>
  );
};

export default Upload;
