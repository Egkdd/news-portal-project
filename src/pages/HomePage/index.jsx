import EmptyComponent from "../../components/EmptyComponent";

import { useState, useEffect, useMemo } from "react";
import { Container, Box, Typography, Divider, Tabs, Tab } from "@mui/material";
import { usePostStore } from "../../hooks/usePostStore";
import NewsList from "../../components/NewsList";
import Pagination from "../../components/Pagination";

import postCategories from "../../assets/constants/postCategories.js";

const postsPerPage = 6;

export default function HomePage() {
  const posts = usePostStore((state) => state.posts);
  const fetchPosts = usePostStore((state) => state.fetchPosts);
  const deletePost = usePostStore((state) => state.deletePost);

  const [open, setOpen] = useState(false);
  const [postToEdit, setPostToEdit] = useState(null);
  const [pageAll, setPageAll] = useState(1);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const paginate = (items, page) => {
    const start = (page - 1) * postsPerPage;
    return items.slice(start, start + postsPerPage);
  };

  const latestPosts = useMemo(() => {
    return [...posts]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3);
  }, [posts]);

  const allPostsSorted = useMemo(() => {
    return [...posts].sort((a, b) => a.title.localeCompare(b.title));
  }, [posts]);

  const allPosts = paginate(allPostsSorted, pageAll);

  const uniqueCategories = postCategories;

  const [selectedCategory, setSelectedCategory] = useState(
    uniqueCategories[0] || ""
  );

  useEffect(() => {
    if (
      uniqueCategories.length > 0 &&
      !uniqueCategories.includes(selectedCategory)
    ) {
      setSelectedCategory(uniqueCategories[0]);
    }
  }, [uniqueCategories, selectedCategory]);

  const filteredPostsByCategory = useMemo(() => {
    return posts.filter((post) => post.categories?.includes(selectedCategory));
  }, [selectedCategory, posts]);

  const handleEditPost = (post) => {
    setPostToEdit(post);
    setOpen(true);
  };

  const handleDeletePost = async (postId) => {
    await deletePost(postId);
  };

  return (
    <Container sx={{ mt: 4, mb: 6 }}>
      {posts.length === 0 ? (
        <EmptyComponent />
      ) : (
        <>
          <Box
            sx={{
              mb: 6,
              p: 4,
              backgroundColor: "#F9FBFA",
              borderRadius: 4,
              border: `1px solid #E1E8EA`,
              boxShadow: "0 4px 14px rgba(0, 0, 0, 0.05)",
            }}
          >
            <Typography
              variant="h5"
              gutterBottom
              fontWeight="bold"
              sx={{ color: "#3E4E59" }}
            >
              Latest Posts
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <NewsList
              posts={latestPosts}
              openEditDialog={handleEditPost}
              onDeletePost={handleDeletePost}
              emptyMessage="No posts found."
              itemWidth={280}
            />
          </Box>

          <Box
            sx={{
              mb: 6,
              p: 4,
              backgroundColor: "#F9FBFA",
              borderRadius: 4,
              border: `1px solid #E1E8EA`,
              boxShadow: "0 4px 14px rgba(0, 0, 0, 0.05)",
            }}
          >
            <Typography
              variant="h5"
              gutterBottom
              fontWeight="bold"
              sx={{ color: "#3E4E59" }}
            >
              By Category
            </Typography>

            <Divider sx={{ mb: 3 }} />

            {uniqueCategories.length > 0 ? (
              <>
                <Tabs
                  value={selectedCategory}
                  onChange={(e, newValue) => setSelectedCategory(newValue)}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{ mb: 3 }}
                >
                  {uniqueCategories.map((category) => (
                    <Tab key={category} value={category} label={category} />
                  ))}
                </Tabs>

                <NewsList
                  posts={filteredPostsByCategory}
                  openEditDialog={handleEditPost}
                  onDeletePost={handleDeletePost}
                  emptyMessage="No posts in this category."
                  itemWidth={280}
                />
              </>
            ) : (
              <Typography color="text.secondary">
                No categories found.
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              p: 4,
              backgroundColor: "#F9FBFA",
              borderRadius: 4,
              border: `1px solid #E1E8EA`,
              boxShadow: "0 4px 14px rgba(0, 0, 0, 0.05)",
            }}
          >
            <Typography
              variant="h5"
              gutterBottom
              fontWeight="bold"
              sx={{ color: "#3E4E59" }}
            >
              All Posts
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <NewsList
              posts={allPosts}
              openEditDialog={handleEditPost}
              onDeletePost={handleDeletePost}
              emptyMessage="No posts found."
              itemWidth={300}
            />

            {allPostsSorted.length > postsPerPage && (
              <Pagination
                totalPosts={allPostsSorted.length}
                postsPerPage={postsPerPage}
                currentPage={pageAll}
                onPageChange={setPageAll}
                sx={{ mt: 4 }}
              />
            )}
          </Box>
        </>
      )}
    </Container>
  );
}
