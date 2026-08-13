import { useEffect } from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import MapIcon from "@mui/icons-material/Map";

function NotFound() {
  useEffect(() => {
    document.title = "Page not found | Chicago Community Compass";
    return () => {
      document.title = "Chicago Community Compass - Food Access";
    };
  }, []);

  return (
    <Box sx={{ textAlign: "center", py: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Page not found
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        That page isn’t here. Maybe the link’s old or wrong.
      </Typography>
      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        flexWrap="wrap"
      >
        <Button
          component={Link}
          to="/"
          variant="contained"
          startIcon={<HomeIcon />}
        >
          Home
        </Button>
        <Button
          component={Link}
          to="/map"
          variant="outlined"
          startIcon={<MapIcon />}
        >
          Find Resources
        </Button>
      </Stack>
    </Box>
  );
}

export default NotFound;
