import {
  Typography,
  Paper,
  Container,
  Box,
  Stack,
  Grid,
} from "@mui/material";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import WorkIcon from "@mui/icons-material/Work";
import GavelIcon from "@mui/icons-material/Gavel";

const futureAreas = [
  {
    icon: <HomeWorkIcon color="primary" />,
    title: "Housing",
    detail: "Shelter, transitional housing, rental assistance",
  },
  {
    icon: <LocalHospitalIcon color="primary" />,
    title: "Healthcare",
    detail: "Community health centers, free clinics",
  },
  {
    icon: <WorkIcon color="primary" />,
    title: "Workforce",
    detail: "Job training, resume help",
  },
  {
    icon: <GavelIcon color="primary" />,
    title: "Legal aid",
    detail: "Immigration, tenant rights, expungement",
  },
];

function About() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight={500}>
          About Chicago Community Compass
        </Typography>
        <Typography variant="h6" color="text.secondary" fontWeight={400}>
          A focused tool for finding food access resources in Chicago
        </Typography>
      </Box>

      <Stack spacing={3}>
        <Paper
          variant="outlined"
          sx={{
            p: 3,
            borderLeftWidth: 4,
            borderLeftStyle: "solid",
            borderLeftColor: "primary.main",
            bgcolor: "action.hover",
          }}
        >
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Before you go
          </Typography>
          <Typography variant="body1">
            Hours and eligibility change often. Always confirm directly with the
            organization before visiting or referring someone.
          </Typography>
        </Paper>

        <Paper variant="outlined" sx={{ p: 3}} >
          <Typography variant="h5" component="h2" gutterBottom fontWeight={600}>
            What this is
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            A place for Chicago residents and caseworkers to find food pantries
            and home delivery programs. 
          </Typography>
        </Paper>

        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom fontWeight={600}>
            Why it's hard to find food help
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Information is spread across many places. Eligibility and referral
            rules aren't always clear. Hours are short and don't line up with
            work. And if you're homebound, geography alone is a barrier. This app
            pulls location, hours, eligibility, and delivery into one spot so you
            can see what's actually near you and what's open.
          </Typography>
        </Paper>

        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom fontWeight={600}>
            Where the data comes from
          </Typography>
          <Typography variant="body1" color="text.secondary">
            The pantry list is a consolidated dataset of Chicago-area food access
            organizations, with program and contact info normalized into one
            structure for the map and list. In a production setting this would be
            refreshed from the city, nonprofits, or providers.
          </Typography>
        </Paper>

        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom fontWeight={600}>
            Where it could go next
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            I started with food access because it's the area I know firsthand
            from my background in food insecurity work in Chicago, which shaped how the
            data and filters are built. The same structure could extend to other
            kinds of social services:
          </Typography>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            {futureAreas.map((area) => (
              <Grid item xs={12} sm={6} key={area.title}>
                <Stack
                  direction="row"
                  spacing={1.5}
                  sx={{
                    p: 2,
                    bgcolor: "action.hover",
                    borderRadius: 1,
                    height: "100%",
                    alignItems: "flex-start",
                  }}
                >
                  {area.icon}
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {area.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {area.detail}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Stack>
    </Container>
  );
}

export default About;