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
  Stack,
  Link,
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

const DAYS_OF_WEEK: (keyof WeeklyHours)[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const DAY_LABELS: Record<keyof WeeklyHours, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

/** Matches weekday keys used by WeeklyHours / foodResourcesService */
function getTodayDayKey(): keyof WeeklyHours {
  const keys: (keyof WeeklyHours)[] = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  return keys[new Date().getDay()];
}

const sectionPanelSx = {
  p: 2,
  borderRadius: 1,
  bgcolor: "action.hover",
  height: "100%",
} as const;

const sectionHeadingSx = {
  display: "flex",
  alignItems: "center",
  gap: 1,
  mb: 1.5,
} as const;

function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const resource = id ? getResourceById(id) : null;
  const todayKey = getTodayDayKey();

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
  const streetLine =
    resource.address?.street ||
    resource.address?.fullAddress ||
    "Address not listed";
  const cityLine =
    [resource.address?.city, resource.address?.state, resource.address?.zip]
      .filter(Boolean)
      .join(", ") || null;

  return (
    <Box sx={{ maxWidth: 960, mx: "auto" }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/map", { state: location.state })}
        sx={{ mb: 1.5 }}
      >
        Back to Resources
      </Button>

      <Paper variant="outlined" sx={{ p: { xs: 2.5, sm: 3 } }}>
        {/* Primary focal point: name, then status chips */}
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 1.5 }}>
          {resource.name}
        </Typography>

        <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1} sx={{ mb: 2 }}>
          <Chip
            size="small"
            label={
              resource.type === RESOURCE_TYPES.FOOD_PANTRY
                ? "Food Pantry"
                : "Food Delivery"
            }
            color={
              resource.type === RESOURCE_TYPES.FOOD_PANTRY
                ? "primary"
                : "secondary"
            }
          />
          {openToday && <Chip size="small" label="Open today" color="success" />}
          {resource.requiresReferral && (
            <Chip size="small" label="Referral Required" color="warning" />
          )}
          {resource.hasDelivery && (
            <Chip
              size="small"
              icon={<DeliveryDiningIcon />}
              label="Delivery Available"
              color="info"
            />
          )}
        </Stack>

        {resource.description ? (
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {resource.description}
          </Typography>
        ) : null}

        <Divider sx={{ mb: 2.5 }} />

        {/* Equal-height panels: left fills to match hours, removing the empty gap */}
        <Grid container spacing={2} alignItems="stretch">
          <Grid item xs={12} md={5}>
            <Box sx={sectionPanelSx}>
              <Box sx={sectionHeadingSx}>
                <LocationOnIcon color="action" fontSize="small" />
                <Typography variant="subtitle1" component="h2" fontWeight={600}>
                  Location
                </Typography>
              </Box>
              <Typography variant="body2">{streetLine}</Typography>
              {cityLine && (
                <Typography variant="body2" color="text.secondary">
                  {cityLine}
                </Typography>
              )}

              <Divider sx={{ my: 2 }} />

              <Typography
                variant="subtitle1"
                component="h2"
                fontWeight={600}
                sx={{ mb: 1.5 }}
              >
                Contact
              </Typography>
              <Stack spacing={1.25}>
                {resource.contact.phone && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PhoneIcon fontSize="small" color="action" />
                    <Typography variant="body2">{resource.contact.phone}</Typography>
                  </Stack>
                )}
                {resource.contact.email && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <EmailIcon fontSize="small" color="action" />
                    <Typography variant="body2">{resource.contact.email}</Typography>
                  </Stack>
                )}
                {resource.contact.website && (
                  <Stack direction="row" spacing={1} alignItems="flex-start">
                    <LanguageIcon fontSize="small" color="action" sx={{ mt: 0.25 }} />
                    <Link
                      href={resource.contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="body2"
                      sx={{ wordBreak: "break-all" }}
                    >
                      {resource.contact.website}
                    </Link>
                  </Stack>
                )}
              </Stack>
            </Box>
          </Grid>

          <Grid item xs={12} md={7}>
            <Box sx={sectionPanelSx}>
              <Box sx={sectionHeadingSx}>
                <AccessTimeIcon color="action" fontSize="small" />
                <Typography variant="subtitle1" component="h2" fontWeight={600}>
                  Hours
                </Typography>
              </Box>

              {resource.hours ? (
                <Stack spacing={0.25}>
                  {DAYS_OF_WEEK.map((day) => {
                    const dayHours = resource.hours?.[day];
                    const isToday = day === todayKey;
                    const hoursLabel =
                      dayHours && dayHours.isOpen
                        ? `${dayHours.open} - ${dayHours.close}`
                        : "Closed";

                    return (
                      <Box
                        key={day}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 2,
                          py: 0.75,
                          px: 1.25,
                          borderRadius: 1,
                          bgcolor: isToday ? "action.selected" : "transparent",
                        }}
                      >
                        <Typography
                          variant="body2"
                          fontWeight={isToday ? 600 : 400}
                          color="text.primary"
                        >
                          {DAY_LABELS[day]}
                          {isToday ? " (Today)" : ""}
                        </Typography>
                        <Typography
                          variant="body2"
                          color={
                            dayHours?.isOpen ? "text.primary" : "text.secondary"
                          }
                          fontWeight={isToday && dayHours?.isOpen ? 600 : 400}
                        >
                          {hoursLabel}
                        </Typography>
                      </Box>
                    );
                  })}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Hours not listed
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default ServiceDetails;
