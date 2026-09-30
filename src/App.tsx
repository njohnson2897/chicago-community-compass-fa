import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";

// Layout
import Layout from "./components/Layout";

// Pages
import Home from "./pages/Home";
import MapView from "./pages/MapView";
import ServiceDetails from "./pages/ServiceDetails";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/map"
            element={
              <Layout>
                <MapView />
              </Layout>
            }
          />
          <Route
            path="/service/:id"
            element={
              <Layout>
                <ServiceDetails />
              </Layout>
            }
          />
          <Route
            path="/about"
            element={
              <Layout>
                <About />
              </Layout>
            }
          />
          <Route
            path="*"
            element={
              <Layout>
                <NotFound />
              </Layout>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
