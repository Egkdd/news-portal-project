import { Container, Typography, Grid, Avatar, Box } from "@mui/material";
import janeImg from "../../assets/images/JaneDoe.jpg";
import johnImg from "../../assets/images/JohnSmith.jpg";
import aliceImg from "../../assets/images/AliceBrown.jpg";
import agencyImg from "../../assets/images/agency.jpg";
import colors from "../../assets/styles/colors";

const teamMembers = [
  { name: "Jane Doe", role: "CEO & Founder", photo: janeImg },
  { name: "John Smith", role: "Creative Director", photo: johnImg },
  { name: "Alice Brown", role: "Marketing Lead", photo: aliceImg },
];

export default function AboutAgencyPage() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6, color: colors.mainColor }}>
      <Typography variant="h4" align="center" fontWeight={700} gutterBottom>
        About Our Agency
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        sx={{ maxWidth: 700, mx: "auto" }}
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum at
        risus sit amet erat iaculis semper. We are driven by passion,
        creativity, and innovation.
      </Typography>

      <Grid container spacing={4} sx={{ mt: 4 }} alignItems="center">
        <Grid
          item
          xs={12}
          md={6}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <img
            src={agencyImg}
            alt="Agency"
            style={{ width: "70%", height: "auto", borderRadius: 8 }}
            loading="lazy"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Who We Are
          </Typography>
          <Typography sx={{ lineHeight: 1.6 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
            volutpat justo quis luctus laoreet. In a massa sollicitudin,
            ullamcorper est ac, ultrices neque. Integer at tortor a justo
            efficitur dignissim.
          </Typography>
        </Grid>
      </Grid>

      <Box sx={{ mt: 8 }}>
        <Typography
          variant="h4"
          align="center"
          fontWeight={600}
          sx={{ mb: 4, textTransform: "uppercase" }}
        >
          Meet Our Team
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          {teamMembers.map(({ name, role, photo }) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={name}
              sx={{ textAlign: "center" }}
            >
              <Avatar
                src={photo}
                alt={name}
                sx={{ width: 100, height: 100, margin: "0 auto 16px" }}
                imgProps={{ loading: "lazy" }}
              />
              <Typography variant="h6" fontWeight={600}>
                {name}
              </Typography>
              <Typography variant="subtitle2">{role}</Typography>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}
