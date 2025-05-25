import { Pagination } from "@mui/material";
import colors from "../../assets/styles/colors";

export default function PaginationComponent({
  totalPosts,
  postsPerPage,
  currentPage,
  onPageChange,
}) {
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  return (
    <Pagination
      count={totalPages}
      page={currentPage}
      onChange={(event, page) => onPageChange(page)}
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 4,
        "& .MuiPaginationItem-root": {
          backgroundColor: colors.borderColor,
          color: colors.textColor,
          borderRadius: 2,
          transition: "0.3s",
          "&:hover": {
            backgroundColor: colors.hoverColor,
            color: colors.textColor,
          },
        },
        "& .MuiPaginationItem-root.Mui-selected": {
          backgroundColor: `${colors.hoverColor} !important`,
          color: `${colors.textColor} !important`,
          fontWeight: "bold",
          border: "1px solid #fff",
        },
      }}
    />
  );
}
