import { Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import colors from "../../assets/styles/colors";

export default function NavButton({ children, to, href, isActive, ...props }) {
  const isRouterLink = Boolean(to);

  return (
    <Button
      component={isRouterLink ? RouterLink : "a"}
      to={isRouterLink ? to : undefined}
      {...props}
      sx={{
        fontSize: "1rem",
        fontWeight: 500,
        color: colors.textColor,
        textTransform: "capitalize",
        borderRadius: "15px",
        backgroundColor: isActive ? colors.hoverColor : "transparent",
        transition: "background-color 0.2s ease, font-size 0.2s ease",
        "&:hover": {
          backgroundColor: colors.hoverColor,
          textDecoration: "none",
          color: colors.textColor,
          transform: "scale(1.05)",
          transition: "transform 0.2s ease, background-color 0.2s ease",
        },
        ...props.sx,
      }}
    >
      {children}
    </Button>
  );
}
