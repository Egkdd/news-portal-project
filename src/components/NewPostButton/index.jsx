import { Button } from "@mui/material";
import colors from "../../assets/styles/colors";

export default function NewPostButton({ label, onClick }) {
  return (
    <Button
      variant="contained"
      onClick={onClick}
      sx={{
        backgroundColor: colors.mainColor,
        color: colors.textColor,
        borderRadius: 2,
        px: 3,
        py: 1,
        fontSize: "0.9rem",
        transition: "transform 0.3s ease, background-color 0.3s ease",
        "&:hover": {
          transform: "scale(1.05)",
          backgroundColor: colors.hoverColor,
        },
      }}
    >
      {label}
    </Button>
  );
}
