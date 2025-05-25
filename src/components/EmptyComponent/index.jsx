import { Box } from "@mui/material";
import colors from "../../assets/styles/colors";
import noPost from "../../assets/images/noPosts.png";

export default function EmptyComponent() {
  return (
    <Box
      sx={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: colors.mainColor,
        backgroundColor: "transparent",
        minHeight: "100%",
        mt: 5,
      }}
    >
      <Box
        component="img"
        src={noPost}
        alt="No posts"
        sx={{
          width: "100%",
          maxWidth: 300,
        }}
      />
    </Box>
  );
}
