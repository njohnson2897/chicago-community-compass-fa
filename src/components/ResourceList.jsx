import {
  Box,
  Typography,
  Chip,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  List,
  ListItem,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import { hasHoursToday, getHoursToday } from "../data/foodResourcesService";

function ResourceList({ resources, onResourceClick, showDistance }) {
  if (!resources || resources.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="body1" color="text.secondary">
          Nothing matches right now. Try a different search or loosen the
          filters.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "100%",
        overflowY: "auto",
        pr: 1,
      }}
    >
      <List disablePadding>
        {resources.map((resource) => {
          const openToday = hasHoursToday(resource);
          const hoursToday = getHoursToday(resource);
          const address = resource.address || {};
          const phone = resource.contact?.phone || null;

          return (
            <ListItem key={resource.id} disableGutters sx={{ mb: 1.5 }}>
              <Card
                elevation={1}
                sx={{
                  width: "100%",
                  borderRadius: 3,
                  "&:hover": {
                    boxShadow: 4,
                    transform: "translateY(-1px)",
                  },
                  transition: "box-shadow 0.15s ease, transform 0.15s ease",
                }}
              >
                <CardActionArea onClick={() => onResourceClick(resource.id)}>
                  <CardContent>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      spacing={2}
                    >
                      <Box>
                        <Typography
                          variant="subtitle1"
                          component="h2"
                          gutterBottom
                        >
                          {resource.name}
                        </Typography>
                        <Stack
                          direction="row"
                          spacing={0.5}
                          alignItems="center"
                          sx={{ mb: 0.5 }}
                        >
                          <LocationOnIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {address.street || address.fullAddress}{" "}
                            {address.city && (
                              <>
                                , {address.city}
                                {address.state && `, ${address.state}`}
                                {address.zip && ` ${address.zip}`}
                              </>
                            )}
                          </Typography>
                        </Stack>
                        {resource.description && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                          >
                            {resource.description}
                          </Typography>
                        )}
                      </Box>

                      <Stack spacing={0.5} alignItems="flex-end">
                        {showDistance &&
                          typeof resource.distanceMiles === "number" && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {resource.distanceMiles < 0.1
                                ? "< 0.1 mi"
                                : `${resource.distanceMiles.toFixed(1)} mi`}
                            </Typography>
                          )}
                        <Chip
                          label="Food Pantry"
                          size="small"
                          color="primary"
                          variant="filled"
                        />
                        {openToday && (
                          <Chip
                            label="Open today"
                            size="small"
                            color="success"
                            sx={{ mt: 0.5 }}
                          />
                        )}
                      </Stack>
                    </Stack>

                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      flexWrap="wrap"
                      sx={{ mt: 1.5 }}
                    >
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <AccessTimeIcon fontSize="small" color="action" />
                        <Typography variant="caption" color="text.secondary">
                          {hoursToday
                            ? `Today: ${hoursToday}`
                            : "Hours not listed"}
                        </Typography>
                      </Stack>

                      {resource.hasDelivery && (
                        <Chip
                          icon={<DeliveryDiningIcon fontSize="small" />}
                          label="Home delivery"
                          size="small"
                          variant="outlined"
                        />
                      )}

                      {phone && (
                        <Typography variant="caption" color="text.secondary">
                          {phone}
                        </Typography>
                      )}
                    </Stack>
                  </CardContent>
                </CardActionArea>
              </Card>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}

export default ResourceList;
