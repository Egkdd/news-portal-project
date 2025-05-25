import { Checkbox, FormControlLabel, Typography } from "@mui/material";
import colors from "../../assets/styles/colors";

export default function CategoryCheckbox({ category, checked, onChange }) {
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={checked}
          onChange={onChange}
          sx={{
            color: colors.borderColor,
            "&.Mui-checked": {
              color: colors.hoverColor,
            },
          }}
        />
      }
      label={
        <Typography sx={{ color: colors.mainColor }}>{category}</Typography>
      }
    />
  );
}
