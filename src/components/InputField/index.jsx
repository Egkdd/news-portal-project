import { TextField } from "@mui/material";
import colors from "../../assets/styles/colors";

const inputStyle = {
  "& label": { color: colors.mainColor },
  "& label.Mui-focused": { color: colors.hoverColor },
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: colors.borderColor },
    "&:hover fieldset": { borderColor: colors.hoverColor },
    "&.Mui-focused fieldset": { borderColor: colors.hoverColor },
    color: "#333",
  },
};

export default function InputField(props) {
  return <TextField {...props} sx={{ ...inputStyle, ...props.sx }} />;
}
