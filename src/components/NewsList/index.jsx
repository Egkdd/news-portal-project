import { Box, Fade } from "@mui/material";
import NewsPost from "../NewsPost";

export default function NewsList({
  posts,
  openEditDialog,
  onDeletePost,
  itemWidth = 280,
}) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      {posts.map((post) => (
        <Fade in key={post.id}>
          <Box sx={{ width: itemWidth, flexShrink: 0 }}>
            <NewsPost
              post={post}
              openEditDialog={openEditDialog}
              onDeletePost={onDeletePost}
            />
          </Box>
        </Fade>
      ))}
    </Box>
  );
}
