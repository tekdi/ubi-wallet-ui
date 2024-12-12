// Home.jsx
import { Box } from "@mui/material";
import Header from "./Header";
import MainContent from "./MainContent";
import BottomNavigationBar from "./BottomNavigationBar";

const Home = () => {
  return (
    <>
      <Header />
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto", // Enables vertical scrolling
          height: "calc(100vh - 160px)", // Adjust height dynamically based on fixed header/footer
          mt: "80PX",
        }}
      >
        <MainContent />
      </Box>

      <BottomNavigationBar />
    </>
  );
};

export default Home;
