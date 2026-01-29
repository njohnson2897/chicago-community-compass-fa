import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  FormControlLabel,
  FormLabel,
  Switch,
  Stack,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PlaceIcon from "@mui/icons-material/Place";

function FilterPanel({ filters, onFilterChange, onSearch, isSearching }) {
  const handleChange = (field, value) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch();
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        Search by location
      </Typography>

      <Stack spacing={2} sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
          <PlaceIcon color="action" fontSize="small" sx={{ mt: 1.5 }} />
          <TextField
            fullWidth
            size="small"
            label="Address or ZIP code"
            variant="outlined"
            placeholder="e.g. 60637 or Lincoln Park, Chicago"
            value={filters.searchLocation || ""}
            onChange={(e) => handleChange("searchLocation", e.target.value)}
            disabled={!!isSearching}
          />
        </Box>

        <FormControl size="small" fullWidth>
          <InputLabel>Within radius</InputLabel>
          <Select
            value={filters.radiusMiles ?? 1}
            label="Within radius"
            onChange={(e) =>
              handleChange("radiusMiles", Number(e.target.value))
            }
          >
            <MenuItem value={0.5}>0.5 mile</MenuItem>
            <MenuItem value={1}>1 mile</MenuItem>
            <MenuItem value={2}>2 miles</MenuItem>
            <MenuItem value={5}>5 miles</MenuItem>
            <MenuItem value={10}>10 miles</MenuItem>
          </Select>
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          startIcon={<SearchIcon />}
          disabled={!filters.searchLocation?.trim() || isSearching}
          fullWidth
        >
          {isSearching ? "Searching…" : "Search"}
        </Button>
      </Stack>

      <FormLabel component="legend" sx={{ mt: 2, mb: 1 }}>
        Narrow it down
      </FormLabel>
      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
        <FormControlLabel
          control={
            <Switch
              size="small"
              checked={!!filters.openToday}
              onChange={(e) => handleChange("openToday", e.target.checked)}
            />
          }
          label="Open today"
        />
        <FormControlLabel
          control={
            <Switch
              size="small"
              checked={filters.hasDelivery === true}
              onChange={(e) => {
                handleChange("hasDelivery", e.target.checked ? true : null);
              }}
            />
          }
          label="Home delivery"
        />
      </Stack>

      <TextField
        fullWidth
        size="small"
        label="Filter by name or address"
        variant="outlined"
        value={filters.searchText || ""}
        onChange={(e) => handleChange("searchText", e.target.value)}
        sx={{ mt: 2 }}
        placeholder="Search by name or address"
      />

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mt: 2 }}
      >
        Type an address or ZIP and hit Search. You’ll only see pantries within
        the radius you pick.
      </Typography>
    </Box>
  );
}

export default FilterPanel;
