import { Card, CardContent, CardMedia, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteButton from "../DeleteButton";
import EditButton from "../EditButton";
import { useAuth } from "../../hooks/useAuthStore";
import { useEffect, useState } from "react";
import { doc, getDoc, deleteDoc, Timestamp } from "firebase/firestore";
import { db } from "../../config/firebase";
import CreateEditPost from "../../modals/CreateEditPost";

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

export default function NewsPost({ post, onDeletePost }) {
  const navigate = useNavigate();
  const currentUser = useAuth();
  const [authorName, setAuthorName] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    const fetchAuthorName = async () => {
      if (post.authorId) {
        const userRef = doc(db, "users", post.authorId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setAuthorName(userData.nickname || "Unknown");
        } else {
          setAuthorName("Unknown");
        }
      } else {
        setAuthorName("Unknown");
      }
    };

    fetchAuthorName();
  }, [post.authorId]);

  const handleClick = () => {
    navigate(`/news/${post.id}`);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await deleteDoc(doc(db, "posts", post.id));
      onDeletePost(post.id);
    } catch (error) {
      console.error("Error deleting post: ", error);
    }
  };

  const handleEditOpen = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
  };

  const canEditOrDelete = currentUser?.uid === post.authorId;

  return (
    <>
      <Card
        onClick={handleClick}
        sx={{
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          borderRadius: 4,
          boxShadow: 4,
          overflow: "hidden",
          transition: "transform 0.3s, box-shadow 0.3s",
          "&:hover": {
            transform: "translateY(-10px)",
            boxShadow: 8,
          },
          "&:hover .editButton, &:hover .deleteButton": {
            opacity: 1,
          },
        }}
      >
        {canEditOrDelete && (
          <>
            <EditButton
              onClick={handleEditOpen}
              className="editButton"
              sx={{
                position: "absolute",
                top: 8,
                right: 52,
                bgcolor: "white",
                opacity: 0,
                transition: "opacity 0.3s ease, transform 0.3s ease",
                cursor: "pointer",
                pointerEvents: "auto",
                "&:hover": {
                  bgcolor: "grey.200",
                  transform: "scale(1.1)",
                  opacity: 1,
                },
                "&:focus": {
                  bgcolor: "grey.300",
                  opacity: 1,
                },
              }}
            />
            <DeleteButton
              onClick={handleDelete}
              className="deleteButton"
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                bgcolor: "white",
                opacity: 0,
                transition: "opacity 0.2s, transform 0.2s",
                "&:hover": {
                  bgcolor: "grey.200",
                  transform: "scale(1.1)",
                },
                "&:focus": {
                  bgcolor: "grey.300",
                },
              }}
            />
          </>
        )}

        {post.image && (
          <CardMedia
            component="img"
            height="180"
            image={post.image}
            alt={post.title}
            loading="lazy"
            sx={{ objectFit: "cover" }}
          />
        )}

        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Typography
            variant="h6"
            gutterBottom
            noWrap
            sx={{ fontWeight: 600, color: "#5F574C" }}
          >
            {post.title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontStyle: post.description ? "normal" : "italic",
              color: post.description ? "text.secondary" : "gray",
            }}
          >
            {post.description || "No description available"}
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              noWrap
              sx={{ color: "#5F574C" }}
            >
              Categories: {post.categories.join(", ")}
            </Typography>
            <Typography
              variant="caption"
              display="block"
              sx={{ mt: 1, color: "#5F574C" }}
            >
              Created at: {formatPostDate(post.createdAt)}
            </Typography>
            {authorName && (
              <Typography
                variant="caption"
                display="block"
                sx={{ mt: 1, color: "#5F574C" }}
              >
                Author: {authorName}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>

      <CreateEditPost
        open={editDialogOpen}
        onClose={handleEditClose}
        postToEdit={post}
      />
    </>
  );
}
