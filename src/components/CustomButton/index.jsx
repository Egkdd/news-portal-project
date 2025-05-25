import { Button } from "@mui/material";
import colors from "../../assets/styles/colors";

export function LinkButton({ children, ...props }) {
  return (
    <Button
      {...props}
      sx={{
        color: colors.hoverColor,
        "&:hover": { textDecoration: "underline" },
        textTransform: "none",
        ...props.sx,
      }}
    >
      {children}
    </Button>
  );
}

export function SubmitButton({ children, ...props }) {
  return (
    <Button
      variant="contained"
      {...props}
      sx={{
        backgroundColor: colors.mainColor,
        color: colors.textColor,
        fontWeight: "bold",
        px: 3,
        py: 1,
        borderRadius: 2,
        "&:hover": {
          backgroundColor: colors.hoverColor,
        },
        ...props.sx,
      }}
    >
      {children}
    </Button>
  );
}
