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

const Fetch = ({ documentType, onDocumentTypeChange }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [selectedDocument, setSelectedDocument] = useState(documentType || "");
  const [docId, setDocId] = useState("");

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

        <FormControl fullWidth sx={{ my: 2 }}>
          <InputLabel sx={{ fontFamily: "Poppins, sans-serif" }}>
            Select Document Type
          </InputLabel>
          <Select
            value={selectedDocument}
            onChange={(e) => setSelectedDocument(e.target.value)}
            label="Select Document Type"
            sx={{ fontFamily: "Poppins, sans-serif" }}
          >
            {documentTypes.map((doc) => (
              <MenuItem key={doc.value} value={doc.value}>
                {doc.label}
              </MenuItem>
            ))}
          </Select>
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
            helperText={
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
            }
          />
        </Box>

        <Button
          variant="contained"
          fullWidth
          startIcon={<DownloadIcon />}
          onClick={() => setOpen(true)}
          sx={{ borderRadius: 7 }}
        >
          Fetch
        </Button>

        {/* Confirmation Dialog */}
        <ShareConfirmationDialog
          open={open}
          onClose={() => setOpen(false)}
          documentType={selectedDocument}
          docId={docId}
        />
      </Container>

      <BottomNavigationBar />
    </Box>
  );
};

export default Fetch;
