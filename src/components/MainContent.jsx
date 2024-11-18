import React from "react";
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
  const flag=1;
  const documents = [
    { id: 1, name: "Caste Certificate", did: "1111111111" },
    { id: 2, name: "Income Certificate", did: "1111111111" },
    { id: 3, name: "Domicile Certificate", did: "1111111111" },
    { id: 4, name: "Marksheet (10th)", did: "1111111111" },
  ];
  if(flag==0) {
    return (
        <Box sx={{ maxWidth: 600, mx: "auto", p: 0.5 }}>
          <Paper elevation={1} sx={{ bgcolor: "background.paper" }}>
            <List sx={{ width: "100%" }}>
              <>
                {documents.map((doc, index) => (
                  <ListItem
                    key={doc.id}
                    disablePadding
                    sx={{
                      py: 1.5,
                      borderBottom:
                        index !== documents.length - 1 ? "1px solid" : "none",
                      borderColor: "divider",
                      display: "flex",
                      alignItems: "flex-start", // Align items at the start (top)
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 ,p:0.5}}>
                      <CheckCircleIcon
                        sx={{
                          color: "#00AB55",
                          fontSize: 24,
                        }}
                      />
                    </ListItemIcon>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <ListItemText
                        primary={doc.name}
                        primaryTypographyProps={{
                          sx: {
                            fontSize: "1rem",
                            fontWeight: 500,
                            color: "text.primary",
                            fontFamily: "Poppins, sans-serif",
                          },
                        }}
                      />
                      <FormHelperText
                        sx={{ ml: 0.4, fontFamily: "Poppins, sans-serif" }}
                      >
                        did : {doc.did}
                      </FormHelperText>
                    </Box>
                  </ListItem>
                ))}
              </>
            </List>
          </Paper>
        </Box>
      );
  }
  return (
        <Container maxWidth="sm" sx={{
          pt: 8,
          pb: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          flexGrow: 1, // Ensures content grows to take available space
        }}>
          <img
            src={NoDocuments}
            alt="No Documents"
            style={{ width: 260, height: 210 }} // Larger image size
          />
          <Typography variant="h5" gutterBottom sx={{fontFamily: "Poppins, sans-serif"}}>
            <b>Bring Your Digital Identity</b>
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{fontFamily: "Poppins, sans-serif"}}>
            Tap on the "+" icon below to add your documents to this wallet
          </Typography>
        </Container>
      );
};

export default MainContent;
