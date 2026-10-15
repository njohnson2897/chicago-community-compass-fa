import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";

// Layout
import Layout from "./components/Layout";

// Pages
const Home = lazy(() => import("./pages/Home"));
const MapView = lazy(() => import("./pages/MapView"));
const ServiceDetails = lazy(() => import("./pages/ServiceDetails"));
const About = lazy(() => import("./pages/About"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/map" element={<Layout><MapView /></Layout>} />
          <Route path="/service/:id" element={<Layout><ServiceDetails /></Layout>} />
          <Route path="/about" element={<Layout><About /></Layout>} />
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
