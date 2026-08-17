import {
  Typography,
  Paper,
  Container,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

function About() {
  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          About Chicago Community Compass
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Food Access Resources
        </Typography>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h5" gutterBottom>
          Where the data comes from
        </Typography>
        <Typography variant="body1" paragraph>
          The pantry list is a consolidated dataset of Chicago-area food access
          orgs—program and contact info normalized into one structure for the
          map and list. In a real setup this would get refreshed from the city,
          nonprofits, or providers.
        </Typography>
        <Typography variant="body1" paragraph sx={{ fontWeight: 500 }}>
          Hours and eligibility change. Always confirm with the organization
          before you go or before you refer someone.
        </Typography>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h5" gutterBottom>
          What this is
        </Typography>
        <Typography variant="body1" paragraph>
          A place for Chicago residents and caseworkers to find food pantries
          and delivery programs. This version is food access only—no housing,
          health, or jobs—so it stays clear and usable.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          Who it’s for
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="Residents"
              secondary="People looking for food help near them"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Caseworkers and providers"
              secondary="Folks helping clients find pantries and delivery"
            />
          </ListItem>
        </List>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          Why it’s hard to find food help
        </Typography>
        <Typography variant="body1" paragraph>
          Info is spread across a lot of places. Eligibility and referral rules
          aren’t always clear. Hours are short and don’t line up with work. And
          if you’re homebound, geography alone is a barrier. This app pulls
          location, hours, eligibility, and delivery into one spot so you can
          see what’s actually near you and what’s open.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          Why food first
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="Need is high"
              secondary="Lots of Chicagoans deal with food insecurity"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Resource types are clear"
              secondary="Pantries and delivery programs are easy to define and filter"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Same patterns work elsewhere"
              secondary="Once this works for food, the approach can extend to housing, health, legal aid, etc."
            />
          </ListItem>
        </List>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h5" gutterBottom>
          Where it could go next
        </Typography>
        <Typography variant="body1" paragraph>
          Right now it’s food only. The same structure could cover housing
          (shelter, rental help), health (clinics, mental health), jobs
          (training, placement), or legal aid (immigration, tenant rights,
          expungement).
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="Housing"
              secondary="Shelter, transitional housing, rental assistance"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Healthcare"
              secondary="Community health centers, free clinics"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Workforce"
              secondary="Job training, resume help"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Legal aid"
              secondary="Immigration, tenant rights, expungement"
            />
          </ListItem>
        </List>

        <Divider sx={{ my: 4 }} />

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 4, fontStyle: "italic" }}
        >
          I’ve worked in food access and community engagement at a Chicago
          nonprofit. The way the data and filters are set up comes from
          that—short hours, referral-only programs, delivery signup, stuff that
          actually comes up when people are looking for help.
        </Typography>
      </Paper>
    </Container>
  );
}

export default About;
