import React, { useState, useEffect } from 'react';
import Header from './Header';
import BottomNavigationBar from './BottomNavigationBar';
import {
  Box,
  Container,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Button,
  Paper
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledSearchBox = styled(Paper)(({ theme }) => ({
  padding: '2px 4px',
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  backgroundColor: "#E9E7EF",
  marginBottom: theme.spacing(2),
  borderRadius: 9,
}));

const DocumentSelector = () => {
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleToggle = (id) => {
    const currentIndex = selectedDocs.indexOf(id);
    const newChecked = [...selectedDocs];

    if (currentIndex === -1) {
      newChecked.push(id);  // Add the ID to selectedDocs if not already selected
    } else {
      newChecked.splice(currentIndex, 1);  // Remove the ID if already selected
    }

    setSelectedDocs(newChecked);
  };

  const handleImportClick = () => {
    const selectedDocuments = documents.filter(doc => selectedDocs.includes(doc.doc_id));
    
    console.log('Selected Documents:', selectedDocuments);
    window.parent.postMessage(
      { type: 'selected-docs', data: selectedDocuments },
      '*'
    );
  };

  useEffect(() => {
    const fetchDocuments = async () => {
      const apiUrl = `${import.meta.env.VITE_APP_API_URL}/user-docs/fetch`;
      const authToken = localStorage.getItem("authToken");

      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch documents");
        }

        const data = await response.json();
        setDocuments(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  return (
    <Box
      sx={{
        pb: 7,
        bgcolor: "#F8F9FA",
        minHeight: "100vh",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {/* Header */}
      <Header />

      <Container maxWidth="sm" sx={{ mt: 2 }}>
        {/* Search Box */}
        <StyledSearchBox>
          <TextField
            fullWidth
            placeholder="Search By Document Name"
            variant="standard"
            InputProps={{
              disableUnderline: true,
              endAdornment: (
                <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />
              ),
            }}
            sx={{ ml: 1 }}
          />
        </StyledSearchBox>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Please choose your required document.
        </Typography>

        {/* Document List */}
        <List>
          {documents.map((doc) => (
            <ListItem key={doc.doc_id} disablePadding sx={{ mb: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                  borderBottom: "1px solid #E0E0E0",
                  pb: 1,
                }}
              >
                <ListItemText
                  primary={doc.doc_type}
                  secondary={doc.doc_id}
                  sx={{ flexGrow: 1 }}
                />
                <Checkbox
                  edge="end"
                  checked={selectedDocs.indexOf(doc.doc_id) !== -1}
                  onChange={() => handleToggle(doc.doc_id)}
                />
              </Box>
            </ListItem>
          ))}
        </List>

        {/* Import Button */}
        <Button
          variant="contained"
          fullWidth
          sx={{
            mt: 2,
            mb: 2,
            textTransform: "none",
            borderRadius: 2,
          }}
          disabled={selectedDocs.length === 0}
          onClick={handleImportClick}
        >
          + Import Documents ({selectedDocs.length})
        </Button>

        {/* Bottom Navigation */}
        <BottomNavigationBar />
      </Container>
    </Box>
  );
};

export default DocumentSelector;
