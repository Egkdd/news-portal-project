import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function DeleteButton({ onClick, className }) {
  return (
    <IconButton
      onClick={onClick}
      className={className}
      sx={{
        position: "absolute",
        top: 8,
        right: 8,
        bgcolor: "white",
        opacity: 0,
        transition: "opacity 0.2s, transform 0.2s",
        "&:hover": {
          bgcolor: "grey.200",
          transform: "scale(1.1)",
        },
        "&:focus": {
          bgcolor: "grey.300",
        },
      }}
    >
      <DeleteIcon color="error" />
    </IconButton>
  );
}
