import { Box, Typography, Button, Paper, Grid, Container } from "@mui/material";
import { Link } from "react-router-dom";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import MapIcon from "@mui/icons-material/Map";
import InfoIcon from "@mui/icons-material/Info";

function Home() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <RestaurantIcon sx={{ fontSize: 80, color: "primary.main", mb: 2 }} />
        <Typography variant="h2" component="h1" gutterBottom>
          Chicago Community Compass
        </Typography>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Food Access Resources
        </Typography>
        <Typography
          variant="body1"
          sx={{ mt: 3, maxWidth: "800px", mx: "auto" }}
        >
          Look up pantries and delivery programs by address or ZIP. See what’s
          open, what needs a referral, and what delivers.
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            component={Link}
            to="/map"
            variant="contained"
            size="large"
            startIcon={<MapIcon />}
            sx={{ mr: 2 }}
          >
            Find Resources
          </Button>
          <Button
            component={Link}
            to="/about"
            variant="outlined"
            size="large"
            startIcon={<InfoIcon />}
          >
            Learn More
          </Button>
        </Box>
      </Box>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: "100%", textAlign: "center" }}>
            <MapIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Interactive Map
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Search by address or ZIP and see pantries on the map.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: "100%", textAlign: "center" }}>
            <RestaurantIcon
              sx={{ fontSize: 48, color: "primary.main", mb: 2 }}
            />
            <Typography variant="h6" gutterBottom>
              Hours &amp; Contact
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Hours, address, phone, and whether they need a referral or offer
              delivery.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: "100%", textAlign: "center" }}>
            <InfoIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Filters
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Narrow by open today, referral needed, delivery, or location.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Home;
