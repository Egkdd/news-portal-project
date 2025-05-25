import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

export default function EditButton({ onClick, className }) {
  return (
    <IconButton
      onClick={onClick}
      className={className}
      sx={{
        position: "absolute",
        top: 8,
        right: 52,
        bgcolor: "white",
        opacity: 0,
        transition: "opacity 0.2s, transform 0.2s",
        cursor: "pointer",
        pointerEvents: "auto",
        "&:hover": {
          bgcolor: "grey.200",
          transform: "scale(1.1)",
          opacity: 1,
          pointerEvents: "auto",
        },
        "&:focus": {
          bgcolor: "grey.300",
          opacity: 1,
          pointerEvents: "auto",
        },
      }}
    >
      <EditIcon color="primary" />
    </IconButton>
  );
}
