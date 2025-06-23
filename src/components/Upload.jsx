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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import ShareConfirmationDialog from "./ShareConfirmationDialog";
import { documentTypes } from "../config";
import Header from "./Header";
import BottomNavigationBar from "./BottomNavigationBar";
import { useNavigate } from "react-router-dom";

const Upload = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [file, setFile] = useState(null); // Store the selected file
  const [fileContent, setFileContent] = useState(null); // Store the content of the file
  const [openPreview, setOpenPreview] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null); // Store the selected document type
  const [errors, setErrors] = useState({ file: "", documentType: "" }); // For error handling
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === "application/json") {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const parsedContent = JSON.parse(event.target.result);
            setFile(selectedFile);
            setFileContent(parsedContent);
            setErrors((prevErrors) => ({ ...prevErrors, file: "" }));
          } catch (err) {
            setFile(null);
            setFileContent(null);
            setErrors((prevErrors) => ({
              ...prevErrors,
              file: "Invalid JSON file. Please upload a valid JSON.",
            }));
          }
        };
        reader.readAsText(selectedFile);
      } else {
        setFile(null);
        setFileContent(null);
        setErrors((prevErrors) => ({
          ...prevErrors,
          file: "Please upload a valid JSON file.",
        }));
      }
    }
  };

  const handleUpload = () => {
    // Validate document type and file
    let formErrors = { file: "", documentType: "" };

    if (!selectedDocument) {
      formErrors.documentType = "Document type is required.";
    }

    if (!file) {
      formErrors.file = "File is required.";
    }

    setErrors(formErrors);

    // If validation passes, show the confirmation dialog
    if (!formErrors.documentType && !formErrors.file) {
      setOpenDialog(true);
    }
  };

  const handleDocumentChange = (e) => {
    const selected = e.target.value;
    const selectedDoc = documentTypes.find((doc) => doc.value === selected); // Find the document object based on selected value
    setSelectedDocument(selectedDoc); // Store the entire selected document object
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
       <Container sx={{ flexGrow: 1 }}>
        <Box sx={{ mt: 2, mb: 4 }}>
          <IconButton onClick={() => navigate("/home")}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="span" sx={{ ml: 2, fontFamily: "Poppins, sans-serif" }}>
            Upload New Document
          </Typography>
        </Box>

        {/* Document Type Select */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom sx={{ fontFamily: "Poppins, sans-serif" }}>
            Select Document Type
          </Typography>

          <FormControl fullWidth error={Boolean(errors.documentType)} sx={{ my: 2 }}>
            <InputLabel id="document-type-label">Select Document Type</InputLabel>
            <Select
              labelId="document-type-label"
              fullWidth
              value={selectedDocument?.value || ""}
              onChange={handleDocumentChange}
              label="Select Document Type"
            >
              {documentTypes.map((doc) => (
                <MenuItem key={doc.value} value={doc.value}>
                  {doc.label}
                </MenuItem>
              ))}
            </Select>
            {errors.documentType && <FormHelperText>{errors.documentType}</FormHelperText>}
          </FormControl>
        </Box>

        {/* File Upload Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom sx={{ fontFamily: "Poppins, sans-serif" }}>
            Select a File to Upload (JSON Only)
          </Typography>

          {/* Hidden file input */}
          <Input
            type="file"
            onChange={handleFileChange}
            fullWidth
            sx={{ display: "none" }}
            id="upload-file-input"
            accept=".json"
          />
          <Button
            variant="outlined"
            fullWidth
            startIcon={<UploadFileIcon />}
            sx={{ mb: 2 }}
            onClick={() => document.getElementById("upload-file-input").click()}
          >
            Upload File
          </Button>

          {file && (
            <Typography variant="body2" color="text.secondary">
              Selected file: {file.name}
            </Typography>
          )}

          {errors.file && (
            <Typography variant="body2" color="error">
              {errors.file}
            </Typography>
          )}
        </Box>

        {/* Preview Button */}
        {file && (
          <Button
            variant="contained"
            fullWidth
            sx={{
              mb: 2,
              borderRadius: 7,
              fontFamily: "Poppins, sans-serif",
              textTransform: "none",
            }}
            onClick={() => setOpenPreview(true)}
          >
            Preview File
          </Button>
        )}

        <Typography variant="caption" color="text.secondary">
          Ensure that the file is in JSON format.
        </Typography>

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 4, borderRadius: 7, fontFamily: "Poppins, sans-serif", textTransform: "none" }}
          startIcon={<UploadFileIcon />}
          onClick={handleUpload}
        >
          Upload
        </Button>

        {/* ShareConfirmationDialog */}
        <ShareConfirmationDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          documentType={selectedDocument?.doc_type}
          documentSubType={selectedDocument?.doc_subtype}
          documentName={selectedDocument?.value}
          file={file}
        />
      </Container>

      {/* JSON Preview Dialog */}
      <Dialog open={openPreview} onClose={() => setOpenPreview(false)} maxWidth="md" fullWidth>
        <DialogTitle>JSON Preview</DialogTitle>
        <DialogContent>
          <pre
            style={{
              background: "#f4f4f4",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              overflowX: "auto",
            }}
          >
            {fileContent ? JSON.stringify(fileContent, null, 2) : "No content to display."}
          </pre>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPreview(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <BottomNavigationBar />
    </Box>
  );
};

export default Upload;