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
  const [selectedDocs, setSelectedDocs] = useState(new Set());  // Use Set for selected documents
  const [documents, setDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);  // Error state for displaying API errors

  // Handle document selection
  const handleToggle = (id) => {
    const newSelectedDocs = new Set(selectedDocs); // Create a new Set to maintain immutability
    if (newSelectedDocs.has(id)) {
      newSelectedDocs.delete(id);
    } else {
      newSelectedDocs.add(id);
    }
    setSelectedDocs(newSelectedDocs);
  };

  // Handle the import button click
  const handleImportClick = () => {
    const selectedDocuments = documents.filter(doc => selectedDocs.has(doc.doc_id));
    const parentAppOrigin = import.meta.env.VITE_PARENT_APP_ORIGIN;

    console.log('Selected Documents:', selectedDocuments);
    window.parent.postMessage(
      { type: 'selected-docs', data: selectedDocuments },
      parentAppOrigin
    );
  };

  // Fetch documents from API
  useEffect(() => {
    const fetchDocuments = async () => {
      const apiUrl = `${import.meta.env.VITE_APP_API_URL}/user-docs/fetch`;
      const authToken = localStorage.getItem("authToken");

      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch documents");
        }

        const data = await response.json();
        setDocuments(data);
      } catch (err) {
        console.error("Error fetching documents:", err.message);
        setError('Error fetching documents. Please try again later.');
      }
    };

    fetchDocuments();
  }, []);

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter documents based on search query
  const filteredDocuments = documents.filter(doc =>
    doc.doc_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            value={searchQuery}
            onChange={handleSearchChange}  // Attach search change handler
            InputProps={{
              disableUnderline: true,
              endAdornment: (
                <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />
              ),
            }}
            sx={{ ml: 1 }}
          />
        </StyledSearchBox>

        {/* Error Handling */}
        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Please choose your required document.
        </Typography>

        {/* Document List */}
        <List>
          {filteredDocuments.map((doc) => (
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
                  primary={doc.doc_name}
                  secondary={doc.doc_id}
                  sx={{ flexGrow: 1 }}
                />
                <Checkbox
                  edge="end"
                  checked={selectedDocs.has(doc.doc_id)}  // Use Set for checking selection
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
          disabled={selectedDocs.size === 0}  // Disable button if no documents are selected
          onClick={handleImportClick}
        >
          + Import Documents ({selectedDocs.size})
        </Button>

        {/* Bottom Navigation */}
        <BottomNavigationBar />
      </Container>
    </Box>
  );
};

export default DocumentSelector;
