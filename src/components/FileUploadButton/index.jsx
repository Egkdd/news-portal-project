import { Button, Typography } from "@mui/material";
import colors from "../../assets/styles/colors";

const uploadButtonStyle = {
  color: colors.mainColor,
  borderColor: colors.borderColor,
  borderRadius: 2,
  fontWeight: 500,
  textTransform: "none",
  "&:hover": {
    backgroundColor: colors.hoverColor,
    color: colors.textColor,
    borderColor: colors.hoverColor,
  },
};

export default function FileUploadButton({ onFileSelect, selectedFile }) {
  return (
    <>
      <Button variant="outlined" component="label" sx={uploadButtonStyle}>
        Upload Image
        <input
          type="file"
          hidden
          onChange={(e) => onFileSelect(e.target.files[0])}
        />
      </Button>
      {selectedFile && (
        <Typography variant="body2" sx={{ color: "#5F574C", mt: 1 }}>
          Selected: {selectedFile.name}
        </Typography>
      )}
    </>
  );
}
