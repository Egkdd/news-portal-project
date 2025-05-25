import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Box,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Fade,
  Link as MuiLink,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import { usePostStore } from "../../hooks/usePostStore";
import { Link as RouterLink } from "react-router-dom";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "../../config/firebase";

function formatPostDate(date) {
  if (!date) return "No date";
  const d = date instanceof Timestamp ? date.toDate() : new Date(date);
  if (isNaN(d)) return "Invalid date";

  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function NewsDetailsPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [authorName, setAuthorName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const posts = usePostStore((state) => state.posts);

  useEffect(() => {
    const foundPost = posts.find((p) => p.id === postId);
    if (foundPost) {
      setPost(foundPost);
      setError(false);
    } else {
      setPost(null);
      setError(true);
    }
    setLoading(false);
  }, [postId, posts]);

  useEffect(() => {
    const fetchAuthorName = async () => {
      if (post?.authorId) {
        try {
          const userRef = doc(db, "users", post.authorId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setAuthorName(userData.nickname || "Unknown");
          } else {
            setAuthorName("Unknown");
          }
        } catch (error) {
          console.error("Error fetching author data:", error);
          setAuthorName("Unknown");
        }
      } else {
        setAuthorName("Unknown");
      }
    };

    if (post) {
      fetchAuthorName();
    }
  }, [post]);

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 8 }}>
        <Typography variant="h6" color="text.secondary">
          Loading post...
        </Typography>
      </Box>
    );
  }

  if (error || !post) {
    return (
      <Box sx={{ textAlign: "center", mt: 8 }}>
        <Typography variant="h6" color="error">
          Post not found.
        </Typography>
        <Tooltip title="Go back">
          <IconButton onClick={() => navigate(-1)} sx={{ mt: 2 }}>
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
      </Box>
    );
  }

  return (
    <Fade in timeout={600}>
      <Container sx={{ mt: 4 }}>
        <Tooltip title="Go back">
          <IconButton onClick={() => navigate(-1)} sx={{ mb: 2 }}>
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>

        <Grid
          container
          spacing={4}
          justifyContent="center"
          alignItems="flex-start"
        >
          {post.image && (
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  width: "100%",
                  height: 250,
                  overflow: "hidden",
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              >
                <img
                  src={post.image}
                  alt={post.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  loading="lazy"
                />
              </Box>
            </Grid>
          )}

          <Grid item xs={12} md={7}>
            <Box sx={{ maxWidth: 600, mx: "auto" }}>
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", color: "#2E3B45" }}
              >
                {post.title}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography
                variant="body1"
                sx={{
                  fontSize: "1.1rem",
                  color: "#5F574C",
                  lineHeight: 1.8,
                  whiteSpace: "pre-line",
                }}
              >
                {post.description}
              </Typography>

              <Stack
                direction="row"
                spacing={2}
                sx={{ mt: 3, flexWrap: "wrap", alignItems: "center", gap: 2 }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CalendarTodayIcon fontSize="small" />
                  <Typography variant="body2">
                    {formatPostDate(post.createdAt)}
                  </Typography>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={1}>
                  <PersonIcon fontSize="small" />
                  <MuiLink
                    component={RouterLink}
                    to={`/profile/${post.authorId}`}
                    sx={{
                      textDecoration: "none",
                      color: "#387478",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    {authorName || "Unknown"}
                  </MuiLink>
                </Stack>
              </Stack>

              {post.categories && post.categories.length > 0 && (
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ mt: 2, flexWrap: "wrap", gap: 1 }}
                >
                  {post.categories.map((category) => (
                    <Typography
                      key={category}
                      variant="caption"
                      sx={{
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        backgroundColor: "#f7fafc",
                        border: "1px solid #cce0db",
                        color: "#387478",
                        fontWeight: 500,
                      }}
                    >
                      {category}
                    </Typography>
                  ))}
                </Stack>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Fade>
  );
}
