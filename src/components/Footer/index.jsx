import { Box, Container, Typography, Stack } from "@mui/material";
import colors from "../../assets/styles/colors.js";

export default function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: colors.mainColor,
        color: colors.textColor,
        py: 2.5,
        mt: 4,
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        <Stack spacing={0.5}>
          <Typography variant="body2" sx={{ fontSize: 14 }}>
            © {new Date().getFullYear()} MySite
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            Made with ❤️ by people who drink too much coffee
          </Typography>
          <Typography
            variant="caption"
            sx={{ fontStyle: "italic", opacity: 0.6 }}
          >
            No cookies were harmed in the making of this site 🍪
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
