import { useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LanguageIcon from "@mui/icons-material/Language";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import { getResourceById, hasHoursToday } from "../data/foodResourcesService";
import { RESOURCE_TYPES } from "../utils/resourceTypes";
import type { WeeklyHours } from "../utils/filterResources";

function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const resource = id ? getResourceById(id) : null;

  useEffect(() => {
    if (resource?.name) {
      document.title = `${resource.name} | Chicago Community Compass`;
    }
    return () => {
      document.title = "Chicago Community Compass - Food Access";
    };
  }, [resource?.name]);

  if (!resource) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h5" gutterBottom>
          We couldn’t find that pantry
        </Typography>
        <Button
          onClick={() => navigate("/map", { state: location.state })}
          startIcon={<ArrowBackIcon />}
        >
          Back to Map
        </Button>
      </Box>
    );
  }

  const openToday = hasHoursToday(resource);
  const daysOfWeek: (keyof WeeklyHours)[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];
const dayLabels: Record<keyof WeeklyHours, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/map", { state: location.state })}
        sx={{ mb: 3 }}
      >
        Back to Resources
      </Button>

      <Paper sx={{ p: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {resource.name}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
              <Chip
                label={
                  resource.type === RESOURCE_TYPES.FOOD_PANTRY
                    ? "Food Pantry"
                    : "Food Delivery"
                }
                color={
                  resource.type === RESOURCE_TYPES.FOOD_PANTRY ? "primary" : "secondary"
                }
              />
              {openToday && <Chip label="Open today" color="success" />}
              {resource.requiresReferral && (
                <Chip label="Referral Required" color="warning" />
              )}
              {resource.hasDelivery && (
                <Chip
                  icon={<DeliveryDiningIcon />}
                  label="Delivery Available"
                  color="info"
                />
              )}
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="body1" paragraph>
          {resource.description}
        </Typography>

        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Location
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <LocationOnIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    resource.address?.street ||
                    resource.address?.fullAddress ||
                    "Address not listed"
                  }
                  secondary={
                    [
                      resource.address?.city,
                      resource.address?.state,
                      resource.address?.zip,
                    ]
                      .filter(Boolean)
                      .join(", ") || null
                  }
                />
              </ListItem>
            </List>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Contact
            </Typography>
            <List dense>
              {resource.contact.phone && (
                <ListItem>
                  <ListItemIcon>
                    <PhoneIcon />
                  </ListItemIcon>
                  <ListItemText primary={resource.contact.phone} />
                </ListItem>
              )}
              {resource.contact.email && (
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon />
                  </ListItemIcon>
                  <ListItemText primary={resource.contact.email} />
                </ListItem>
              )}
              {resource.contact.website && (
                <ListItem>
                  <ListItemIcon>
                    <LanguageIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <a
                        href={resource.contact.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {resource.contact.website}
                      </a>
                    }
                  />
                </ListItem>
              )}
            </List>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Hours
            </Typography>
            <List dense>
  {resource.hours ? (
    (() => {
      const hours = resource.hours;
      return daysOfWeek.map((day) => {
        const dayHours = hours[day];
        return (
          <ListItem key={day}>
            <ListItemIcon>
              <AccessTimeIcon />
            </ListItemIcon>
            <ListItemText
              primary={dayLabels[day]}
              secondary={
                dayHours && dayHours.isOpen
                  ? `${dayHours.open} - ${dayHours.close}`
                  : "Closed"
              }
            />
          </ListItem>
        );
      });
    })()
  ) : (
    <ListItem>
      <ListItemText primary="Hours" secondary="Not listed" />
    </ListItem>
  )}
</List>
          </Grid>
        </Grid>

      </Paper>
    </Box>
  );
}

export default ServiceDetails;
