import { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Typography,
  Box,
  Paper,
  Chip,
} from "@mui/material";
import { usePostStore } from "../../hooks/usePostStore";
import NewsList from "../../components/NewsList";
import ActionButton from "../../components/NewPostButton";
import colors from "../../assets/styles/colors";
import postCategories from "../../assets/constants/postCategories.js";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [lastSearchQuery, setLastSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);

  const posts = usePostStore((state) => state.posts);
  const fetchPosts = usePostStore((state) => state.fetchPosts);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSearch = () => {
    setSearchPerformed(true);
    setLastSearchQuery(searchQuery);

    const query = searchQuery.trim().toLowerCase();

    const filtered = posts.filter((post) => {
      const matchesTitle = post.title.toLowerCase().includes(query);
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.some((cat) => post.categories.includes(cat));
      return matchesTitle && matchesCategory;
    });

    setFilteredPosts(filtered);
  };

  useEffect(() => {
    if (searchPerformed) {
      handleSearch();
    }
  }, [selectedCategories]);

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 8 }}>
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          color: colors.mainColor,
          fontWeight: "700",
          textAlign: "center",
          letterSpacing: 1.2,
          textTransform: "uppercase",
          userSelect: "none",
        }}
      >
        Search Posts
      </Typography>

      <Paper
        elevation={6}
        sx={{
          px: { xs: 3, sm: 5 },
          py: 4,
          borderRadius: 5,
          border: `1.5px solid ${colors.borderColor}`,
          backgroundColor: colors.mainColor,
          boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
        }}
      >
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            width: "100%",
          }}
        >
          <TextField
            variant="outlined"
            placeholder="Search by title"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              flexGrow: 1,
              maxWidth: 400,
              minWidth: 250,
              backgroundColor: "#fff",
              borderRadius: 3,
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                "& fieldset": {
                  borderColor: colors.borderColor,
                },
                "&:hover fieldset": {
                  borderColor: colors.hoverColor,
                },
                "&.Mui-focused fieldset": {
                  borderColor: colors.hoverColor,
                  borderWidth: 2,
                },
              },
              "& input::placeholder": {
                color: colors.mainColor,
                opacity: 0.7,
                fontWeight: 500,
              },
            }}
          />

          <ActionButton
            label="Search"
            onClick={handleSearch}
            sx={{
              minWidth: 120,
              px: 3,
              py: 1.5,
              fontWeight: 600,
              borderRadius: 3,
              textTransform: "uppercase",
              boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
              transition: "background-color 0.3s ease, transform 0.2s ease",
              "&:hover": {
                backgroundColor: colors.hoverColor,
                transform: "scale(1.05)",
                boxShadow: "0 6px 15px rgba(0,0,0,0.25)",
              },
            }}
          />
        </Box>

        <Box
          sx={{
            mt: 3,
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            justifyContent: "center",
          }}
        >
          {postCategories.map((category) => (
            <Chip
              key={category}
              label={category}
              clickable
              color={
                selectedCategories.includes(category) ? "primary" : "default"
              }
              onClick={() => toggleCategory(category)}
              sx={{
                userSelect: "none",
                fontWeight: 600,
                borderRadius: 2,
                backgroundColor: selectedCategories.includes(category)
                  ? colors.hoverColor
                  : "rgba(255,255,255,0.15)",
                color: selectedCategories.includes(category) ? "#fff" : "#eee",
                transition: "background-color 0.3s, color 0.3s",
                "&:hover": {
                  backgroundColor: colors.hoverColor,
                  color: "#fff",
                },
              }}
            />
          ))}
        </Box>
      </Paper>

      {searchPerformed && filteredPosts.length === 0 && (
        <Typography
          sx={{
            mt: 5,
            color: colors.mainColor,
            textAlign: "center",
            fontStyle: "italic",
            fontWeight: 600,
            fontSize: "1.1rem",
            userSelect: "none",
          }}
        >
          No posts found for "{lastSearchQuery}"
        </Typography>
      )}

      <Box sx={{ mt: 5 }}>
        <NewsList posts={filteredPosts} />
      </Box>
    </Container>
  );
}
