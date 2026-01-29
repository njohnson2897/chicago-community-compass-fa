import { useState, useEffect } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Link,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import RestaurantIcon from "@mui/icons-material/Restaurant";

function Layout({ children }) {
  // eslint-disable-line react/prop-types -- Layout is a wrapper; children is standard
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Per-route document title for tabs and bookmarks
  useEffect(() => {
    const path = location.pathname;
    if (path === "/")
      document.title = "Chicago Community Compass - Food Access";
    else if (path === "/map")
      document.title = "Find Resources | Chicago Community Compass";
    else if (path === "/about")
      document.title = "About | Chicago Community Compass";
    else if (path.startsWith("/service/"))
      document.title = "Resource Details | Chicago Community Compass";
  }, [location.pathname]);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/map", label: "Find Resources" },
    { path: "/about", label: "About" },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Chicago Community Compass
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem
            key={item.path}
            component={RouterLink}
            to={item.path}
            disablePadding
          >
            <ListItemText
              primary={item.label}
              sx={{
                textAlign: "center",
                color:
                  location.pathname === item.path
                    ? "primary.main"
                    : "text.primary",
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <a
        href="#main-content"
        className="skip-link"
        style={{
          position: "absolute",
          left: -9999,
          zIndex: 9999,
          padding: "12px 16px",
          background: theme.palette.primary.main,
          color: "#fff",
          textDecoration: "none",
          fontWeight: 600,
          borderRadius: 4,
        }}
        onFocus={(e) => {
          e.target.style.left = "16px";
          e.target.style.top = "16px";
        }}
        onBlur={(e) => {
          e.target.style.left = "-9999px";
          e.target.style.top = "";
        }}
      >
        Skip to main content
      </a>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Link
            component={RouterLink}
            to="/"
            color="inherit"
            underline="none"
            sx={{
              display: "flex",
              alignItems: "center",
              flexGrow: 1,
            }}
          >
            <RestaurantIcon sx={{ mr: 2 }} />
            <Typography variant="h6" component="span">
              Chicago Community Compass
            </Typography>
          </Link>
          {!isMobile && (
            <Box sx={{ display: "flex", gap: 2 }}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  component={RouterLink}
                  to={item.path}
                  color="inherit"
                  variant={
                    location.pathname === item.path ? "outlined" : "text"
                  }
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
        }}
      >
        {drawer}
      </Drawer>

      <Container
        id="main-content"
        maxWidth="xl"
        sx={{ flex: 1, py: 4 }}
        tabIndex={-1}
      >
        {children}
      </Container>

      <Box
        component="footer"
        sx={{
          bgcolor: "background.paper",
          py: 3,
          mt: "auto",
          borderTop: 1,
          borderColor: "divider",
        }}
      >
        <Container maxWidth="xl">
          <Typography variant="body2" color="text.secondary" align="center">
            Chicago Community Compass — Food Access Resources
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            align="center"
            display="block"
            sx={{ mt: 0.5 }}
          >
            Hours and locations change—confirm with the pantry before you go.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default Layout;
