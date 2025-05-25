import { RadioGroup, FormControlLabel, Radio } from "@mui/material";
import colors from "../../assets/styles/colors";

const radioStyle = {
  color: colors.textColor,
  "&.Mui-checked": { color: colors.hoverColor },
};

export default function RadioButtonGroup({
  options,
  value,
  onChange,
  row = false,
}) {
  return (
    <RadioGroup
      row={row}
      value={value}
      onChange={onChange}
      sx={{ color: "#5F574C" }}
    >
      {options.map(({ label, value }) => (
        <FormControlLabel
          key={value}
          value={value}
          control={<Radio sx={radioStyle} />}
          label={label}
        />
      ))}
    </RadioGroup>
  );
}
