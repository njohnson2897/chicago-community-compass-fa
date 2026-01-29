import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Alert,
  Box,
  Grid,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
  useTheme,
  Divider,
  Stack,
  Button,
  Pagination,
} from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import ListIcon from "@mui/icons-material/List";
import PlaceIcon from "@mui/icons-material/Place";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ResourceMap from "../components/ResourceMap";
import ResourceList from "../components/ResourceList";
import FilterPanel from "../components/FilterPanel";
import { getAllResources } from "../data/foodResourcesService";
import { filterResources, getDefaultFilters } from "../utils/filterResources";
import { geocodeSearchQuery } from "../utils/locationUtils";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || "";

function MapView() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Restore map state when returning from Service Details (Back to Resources)
  const savedState = location.state?.mapState;

  const [resources] = useState(() => getAllResources());
  const [filters, setFilters] = useState(() =>
    savedState?.filters ? savedState.filters : getDefaultFilters(),
  );
  const [filteredResources, setFilteredResources] = useState([]);
  const [viewMode, setViewMode] = useState(savedState?.viewMode ?? "list");
  const [page, setPage] = useState(savedState?.page ?? 1);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const pageSize = 10;

  // Recompute filtered results whenever filters (including searchCenter) change
  useEffect(() => {
    const next = filterResources(resources, filters);
    setFilteredResources(next);
    setPage(1);
  }, [filters, resources]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const handleSearch = useCallback(async () => {
    const query = filters.searchLocation?.trim();
    if (!query) return;

    setSearchError(null);
    setIsSearching(true);
    try {
      const center = await geocodeSearchQuery(query, MAPBOX_TOKEN);
      if (center) {
        setFilters((prev) => ({
          ...prev,
          searchCenter: center,
        }));
      } else {
        setSearchError(
          "We couldn’t find that location. Try a different address or ZIP.",
        );
      }
    } finally {
      setIsSearching(false);
    }
  }, [filters.searchLocation]);

  const handleResourceClick = (resourceId) => {
    navigate(`/service/${resourceId}`, {
      state: {
        mapState: {
          filters,
          page,
          viewMode,
        },
      },
    });
  };

  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) setViewMode(newMode);
  };

  const totalPages = Math.max(
    1,
    Math.ceil(filteredResources.length / pageSize),
  );
  const startIndex = (page - 1) * pageSize;
  const pagedResources = filteredResources.slice(
    startIndex,
    startIndex + pageSize,
  );

  const header = (
    <Box sx={{ mb: 3 }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={1}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
      >
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Find Food Access Resources
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Type an address or ZIP and pick a radius to see pantries near you.
          </Typography>
        </Box>
        {isMobile && (
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            aria-label="view mode"
            size="small"
          >
            <ToggleButton value="list" aria-label="list view">
              <ListIcon sx={{ mr: 1 }} />
              List
            </ToggleButton>
            <ToggleButton value="map" aria-label="map view">
              <MapIcon sx={{ mr: 1 }} />
              Map
            </ToggleButton>
          </ToggleButtonGroup>
        )}
      </Stack>

      <Box
        sx={{
          mt: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Hours and locations can change—confirm with the pantry before you go.
        </Typography>
        <Button
          component={Link}
          to="/about"
          size="small"
          color="primary"
          startIcon={<InfoOutlinedIcon fontSize="small" />}
        >
          About this project
        </Button>
      </Box>

      <Divider sx={{ mt: 2 }} />
    </Box>
  );

  const hasSearched = !!filters.searchCenter;
  const emptyState = (
    <Box sx={{ p: 3, textAlign: "center" }}>
      <PlaceIcon sx={{ fontSize: 48, color: "action.disabled", mb: 1 }} />
      <Typography variant="body2" color="text.secondary">
        {hasSearched
          ? `No pantries within ${filters.radiusMiles ?? 1} mile(s). Try a bigger radius or a different address.`
          : "Type an address or ZIP and click Search to see pantries nearby."}
      </Typography>
    </Box>
  );

  const listContent = (
    <>
      <Box sx={{ flex: 1, minHeight: 0, overflow: "auto" }}>
        {filteredResources.length === 0 ? (
          emptyState
        ) : (
          <ResourceList
            resources={pagedResources}
            onResourceClick={handleResourceClick}
            showDistance
          />
        )}
      </Box>
      {filteredResources.length > 0 && (
        <Box
          sx={{
            pt: 1,
            mt: 1,
            borderTop: 1,
            borderColor: "divider",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Showing {startIndex + 1}–
            {Math.min(filteredResources.length, startIndex + pageSize)} of{" "}
            {filteredResources.length}
          </Typography>
          <Pagination
            size="small"
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
          />
        </Box>
      )}
    </>
  );

  if (isMobile) {
    return (
      <Box>
        {header}
        <Box sx={{ mb: 2 }}>
          <Paper sx={{ p: 2 }}>
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              onSearch={handleSearch}
              isSearching={isSearching}
            />
            {searchError && (
              <Alert
                severity="info"
                sx={{ mt: 2 }}
                onClose={() => setSearchError(null)}
              >
                {searchError}
              </Alert>
            )}
          </Paper>
        </Box>

        {viewMode === "list" ? (
          <Box>{listContent}</Box>
        ) : (
          <Paper sx={{ minHeight: 400, overflow: "hidden" }}>
            <ResourceMap
              resources={filteredResources}
              searchCenter={filters.searchCenter}
              radiusMiles={filters.radiusMiles ?? 1}
              onResourceClick={handleResourceClick}
            />
          </Paper>
        )}
      </Box>
    );
  }

  return (
    <Box>
      {header}
      <Grid container spacing={3} sx={{ minHeight: "70vh" }}>
        <Grid item xs={12} md={5} lg={4}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              height: "70vh",
            }}
          >
            <Paper sx={{ p: 2 }}>
              <FilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                onSearch={handleSearch}
                isSearching={isSearching}
              />
              {searchError && (
                <Alert
                  severity="info"
                  sx={{ mt: 2 }}
                  onClose={() => setSearchError(null)}
                >
                  {searchError}
                </Alert>
              )}
            </Paper>
            <Paper
              sx={{
                flex: 1,
                minHeight: 0,
                p: 1,
                borderRadius: 3,
                boxShadow: 1,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  minHeight: 0,
                }}
              >
                {listContent}
              </Box>
            </Paper>
          </Box>
        </Grid>
        <Grid item xs={12} md={7} lg={8}>
          <Paper
            sx={{
              minHeight: 0,
              height: "70vh",
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: 2,
            }}
          >
            <ResourceMap
              resources={filteredResources}
              searchCenter={filters.searchCenter}
              radiusMiles={filters.radiusMiles ?? 1}
              onResourceClick={handleResourceClick}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default MapView;
