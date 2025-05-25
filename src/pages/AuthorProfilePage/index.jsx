import { useEffect, useState } from "react";
import { db } from "../../config/firebase";
import {
  doc,
  getDoc,
  getDocs,
  query,
  where,
  collection,
} from "firebase/firestore";
import { Container, Typography, Avatar, Box, Paper } from "@mui/material";
import { useParams } from "react-router-dom";
import EditButton from "../../components/EditButton";
import { useAuth } from "../../hooks/useAuthStore";
import UpdateProfileInfo from "../../modals/UpdateProfileInfo";
import CreateEditPost from "../../modals/CreateEditPost";
import NewsList from "../../components/NewsList";
import colors from "../../assets/styles/colors";
import EmptyComponent from "../../components/EmptyComponent";
import NewPostButton from "../../components/NewPostButton";

export default function AuthorProfilePage() {
  const { userId } = useParams();

  const currentUser = useAuth();
  const isAuthenticated = Boolean(currentUser);
  const isOwnProfile = currentUser?.uid === userId;

  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [postToEdit, setPostToEdit] = useState(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  useEffect(() => {
    async function fetchUserProfileAndPosts() {
      if (!userId) return;

      const userDoc = await getDoc(doc(db, "users", userId));
      if (!userDoc.exists()) return;

      setUserData(userDoc.data());

      const postsQuery = query(
        collection(db, "posts"),
        where("authorId", "==", userId)
      );
      const querySnapshot = await getDocs(postsQuery);

      const postsData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setUserPosts(postsData);
    }

    fetchUserProfileAndPosts();
  }, [userId]);

  const handleOpenEditPost = (post) => {
    setPostToEdit(post);
    setIsPostModalOpen(true);
  };

  const handleDeletePost = (postId) => {
    setUserPosts((posts) => posts.filter((post) => post.id !== postId));
  };

  const handleClosePostModal = () => {
    setIsPostModalOpen(false);
    setPostToEdit(null);
  };

  const handlePostCreated = (newPost) => {
    setUserPosts((posts) => [newPost, ...posts]);
    handleClosePostModal();
  };

  const handlePostUpdated = (updatedPost) => {
    setUserPosts((posts) =>
      posts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
    handleClosePostModal();
  };

  if (!userData) {
    return (
      <Container sx={{ mt: 5 }}>
        <Typography variant="h6" sx={{ color: colors.textColor }}>
          Loading profile...
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 2, position: "relative", pb: 6 }}>
      {isAuthenticated && isOwnProfile && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <EditButton onClick={() => setIsEditingProfile(true)} alwaysVisible />
        </Box>
      )}

      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: 4,
          backgroundColor: colors.mainColor,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          border: `1px solid ${colors.borderColor}`,
        }}
      >
        <Avatar
          src={userData.avatar || ""}
          alt="User Avatar"
          sx={{
            width: 110,
            height: 110,
            border: `3px solid ${colors.hoverColor}`,
          }}
        />
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: colors.textColor,
            textAlign: "center",
          }}
        >
          {userData.nickname || "No nickname"}
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: colors.textColor, opacity: 0.7 }}
        >
          {userData.email}
        </Typography>
        <Box sx={{ mt: 1, textAlign: "center", maxWidth: 500 }}>
          <Typography
            variant="body2"
            sx={{
              color: colors.textColor,
              whiteSpace: "pre-line",
              opacity: 0.85,
            }}
          >
            {userData.bio || "No bio provided."}
          </Typography>
        </Box>
      </Paper>

      <Box
        sx={{
          mt: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            mt: { xs: 1, sm: 3 },
            mb: { xs: 3, sm: 4 },
            width: { xs: "100%", sm: 280 * 3 },
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: { xs: "center", sm: "space-between" },
            alignItems: "center",
            flexWrap: "wrap",
            gap: { xs: 2, sm: 0 },
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: colors.mainColor,
              mb: { sm: 0 },
              textAlign: "center",
              borderBottom: `2px solid ${colors.hoverColor}`,
              display: "inline-block",
              pb: 0.5,
            }}
          >
            Posts by {userData.nickname || "this user"}
          </Typography>

          {isAuthenticated && isOwnProfile && (
            <NewPostButton
              label="New Post"
              onClick={() => {
                setPostToEdit(null);
                setIsPostModalOpen(true);
              }}
            />
          )}
        </Box>

        {userPosts.length === 0 ? (
          <EmptyComponent
            sx={{
              mt: 2,
              color: colors.mainColor,
              opacity: 0.5,
              textAlign: "center",
            }}
          />
        ) : (
          <NewsList
            posts={userPosts}
            openEditDialog={handleOpenEditPost}
            onDeletePost={handleDeletePost}
            maxWidth={300}
          />
        )}
      </Box>

      <UpdateProfileInfo
        open={isEditingProfile}
        onClose={() => setIsEditingProfile(false)}
        userData={userData}
        userId={userId}
        onUpdated={(newData) =>
          setUserData((prev) => ({ ...prev, ...newData }))
        }
      />

      <CreateEditPost
        open={isPostModalOpen}
        onClose={handleClosePostModal}
        postToEdit={postToEdit}
        onPostUpdated={handlePostUpdated}
        onPostCreated={handlePostCreated}
      />
    </Container>
  );
}
