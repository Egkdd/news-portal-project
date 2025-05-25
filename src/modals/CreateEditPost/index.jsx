import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  RadioGroup,
  FormGroup,
  FormControlLabel,
  Radio,
  Typography,
} from "@mui/material";

import { usePostStore } from "../../hooks/usePostStore";
import { useAuth } from "../../hooks/useAuthStore";
import { storage, db } from "../../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";

import postCategories from "../../assets/constants/postCategories";
import colors from "../../assets/styles/colors";

import FileUploadButton from "../../components/FileUploadButton";
import CategoryCheckbox from "../../components/CategoryCheckbox";
import InputField from "../../components/InputField";
import { SubmitButton, LinkButton } from "../../components/CustomButton";

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

export default function CreateEditPost({ open, onClose, postToEdit }) {
  const user = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageLink, setImageLink] = useState("");
  const [uploadMethod, setUploadMethod] = useState("file");
  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});

  const addPost = usePostStore((state) => state.addPost);
  const updatePost = usePostStore((state) => state.updatePost);

  useEffect(() => {
    if (postToEdit) {
      setTitle(postToEdit.title);
      setDescription(postToEdit.description);
      setCategories(postToEdit.categories);
      setImageLink(postToEdit.image);
      setUploadMethod("link");
      setImageFile(null);
    } else {
      setTitle("");
      setDescription("");
      setImageFile(null);
      setImageLink("");
      setCategories([]);
      setUploadMethod("file");
    }
    setErrors({});
  }, [postToEdit, open]);

  const validate = () => {
    const newErrors = {};

    if (!user?.uid) {
      newErrors.global = "You must be logged in to create a post.";
    }

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    if (categories.length === 0) {
      newErrors.categories = "Please select at least one category";
    }

    if (uploadMethod === "link") {
      if (!imageLink.trim()) {
        newErrors.imageLink = "Image URL is required";
      } else if (!isValidUrl(imageLink.trim())) {
        newErrors.imageLink = "Invalid URL format";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCategoryChange = (category) => {
    setCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setUploading(true);

    try {
      let imageUrl = "";

      if (uploadMethod === "file" && imageFile) {
        const imageRef = ref(
          storage,
          `post-images/${Date.now()}-${imageFile.name}`
        );
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      } else if (uploadMethod === "link") {
        imageUrl = imageLink.trim();
      } else if (postToEdit && !imageFile) {
        imageUrl = postToEdit.image;
      }

      const now = new Date();
      const formattedDate = `${now.getHours().toString().padStart(2, "0")}:${now
        .getMinutes()
        .toString()
        .padStart(2, "0")} ${now.getDate().toString().padStart(2, "0")}-${(
        now.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${now.getFullYear()}`;

      const updatedPost = {
        title,
        description,
        image: imageUrl,
        categories,
        createdAt: serverTimestamp(),
        ...(postToEdit ? {} : { authorId: user.uid }),
      };

      let newPostRef;

      if (postToEdit) {
        await updatePost(postToEdit.id, updatedPost);
      } else {
        newPostRef = await addPost(updatedPost);
      }

      if (newPostRef && user?.uid) {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          await updateDoc(userRef, {
            newsIds: arrayUnion(newPostRef.id),
          });
        }
      }

      handleClose();
    } catch (error) {
      setErrors({ global: "Error during upload: " + error.message });
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setImageFile(null);
    setImageLink("");
    setUploadMethod("file");
    setCategories([]);
    setErrors({});
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: 500,
          maxHeight: "95vh",
          borderRadius: 4,
          boxShadow: 10,
          bgcolor: "#f5f9f7",
          px: 3,
          py: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          color: colors.mainColor,
          fontWeight: 600,
          fontSize: 22,
          textAlign: "center",
        }}
      >
        {postToEdit ? "Edit Post" : "Create New Post"}
      </DialogTitle>

      <DialogContent
        sx={{
          px: 4,
          py: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <InputField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          sx={{ mt: 1 }}
          error={Boolean(errors.title)}
          helperText={errors.title}
        />

        <InputField
          label="Description"
          fullWidth
          multiline
          minRows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <RadioGroup
          row
          value={uploadMethod}
          onChange={(e) => setUploadMethod(e.target.value)}
        >
          <FormControlLabel
            value="file"
            control={
              <Radio
                sx={{
                  color: colors.textColor,
                  "&.Mui-checked": { color: colors.hoverColor },
                }}
              />
            }
            label="Upload File"
          />
          <FormControlLabel
            value="link"
            control={
              <Radio
                sx={{
                  color: colors.textColor,
                  "&.Mui-checked": { color: colors.hoverColor },
                }}
              />
            }
            label="Use Link"
          />
        </RadioGroup>

        {uploadMethod === "file" && (
          <FileUploadButton
            onFileSelect={setImageFile}
            selectedFile={imageFile}
          />
        )}

        {uploadMethod === "link" && (
          <InputField
            label="Image URL"
            fullWidth
            value={imageLink}
            onChange={(e) => setImageLink(e.target.value)}
            error={Boolean(errors.imageLink)}
            helperText={errors.imageLink}
          />
        )}

        <FormGroup sx={{ pl: 1 }}>
          {postCategories.map((category) => (
            <CategoryCheckbox
              key={category}
              category={category}
              checked={categories.includes(category)}
              onChange={() => handleCategoryChange(category)}
            />
          ))}
        </FormGroup>

        {errors.categories && (
          <Typography
            variant="body2"
            sx={{
              color: "error.main",
              fontWeight: 500,
              textAlign: "center",
              mt: 1,
            }}
          >
            {errors.categories}
          </Typography>
        )}

        {errors.global && (
          <Typography
            variant="body2"
            sx={{
              color: "error.main",
              fontWeight: 500,
              textAlign: "center",
              mt: 1,
            }}
          >
            {errors.global}
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: "flex-end", pt: 3 }}>
        <LinkButton onClick={handleClose} disabled={uploading}>
          Cancel
        </LinkButton>
        <SubmitButton onClick={handleSubmit} disabled={uploading}>
          {uploading ? "Uploading..." : postToEdit ? "Update" : "Create"}
        </SubmitButton>
      </DialogActions>
    </Dialog>
  );
}
