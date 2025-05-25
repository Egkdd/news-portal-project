import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, db } from "../../config/firebase";
import { doc, updateDoc } from "firebase/firestore";
import colors from "../../assets/styles/colors";

import InputField from "../../components/InputField";
import FileUploadButton from "../../components/FileUploadButton";
import { LinkButton, SubmitButton } from "../../components/CustomButton";

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

export default function UpdateProfileInfo({
  open,
  onClose,
  userData,
  userId,
  onUpdated,
}) {
  const [nickname, setNickname] = useState("");
  const [bio, setBio] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarLink, setAvatarLink] = useState("");
  const [uploadMethod, setUploadMethod] = useState("file");
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open && userData) {
      setNickname(userData.nickname || "");
      setBio(userData.bio || "");
      setAvatarLink(userData.avatar || "");
      setUploadMethod("file");
      setAvatarFile(null);
      setErrors({});
    }
  }, [open, userData]);

  const validate = () => {
    const newErrors = {};
    if (!nickname.trim()) {
      newErrors.nickname = "Nickname is required";
    }
    if (uploadMethod === "link") {
      if (!avatarLink.trim()) {
        newErrors.avatarLink = "Avatar link is required";
      } else if (!isValidUrl(avatarLink.trim())) {
        newErrors.avatarLink = "Invalid URL format";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setUploading(true);
    let avatarUrl = userData.avatar || "";

    if (uploadMethod === "file" && avatarFile) {
      const avatarRef = ref(
        storage,
        `avatars/${userId}-${Date.now()}-${avatarFile.name}`
      );
      await uploadBytes(avatarRef, avatarFile);
      avatarUrl = await getDownloadURL(avatarRef);
    } else if (uploadMethod === "link" && avatarLink.trim() !== "") {
      avatarUrl = avatarLink.trim();
    }

    const updatedData = {
      nickname,
      bio,
      avatar: avatarUrl,
    };

    await updateDoc(doc(db, "users", userId), updatedData);

    onUpdated(updatedData);
    setUploading(false);
    handleClose();
  };

  const handleClose = () => {
    setNickname("");
    setBio("");
    setAvatarFile(null);
    setAvatarLink("");
    setUploadMethod("file");
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
          mb: 1,
        }}
      >
        Update Profile Info
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
          label="Nickname"
          fullWidth
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          sx={{ mt: 1 }}
          error={Boolean(errors.nickname)}
          helperText={errors.nickname}
        />
        <InputField
          label="Bio"
          fullWidth
          multiline
          minRows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
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
            onFileSelect={setAvatarFile}
            selectedFile={avatarFile}
          />
        )}

        {uploadMethod === "link" && (
          <InputField
            label="Avatar Link"
            fullWidth
            value={avatarLink}
            onChange={(e) => setAvatarLink(e.target.value)}
            error={Boolean(errors.avatarLink)}
            helperText={errors.avatarLink}
          />
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: "flex-end", pt: 3 }}>
        <LinkButton onClick={handleClose}>Cancel</LinkButton>
        <SubmitButton
          onClick={handleSubmit}
          disabled={uploading}
          sx={{
            fontWeight: "bold",
            borderRadius: 2,
            "&:hover": { backgroundColor: "#2f5f61" },
          }}
        >
          {uploading ? "Updating..." : "Update"}
        </SubmitButton>
      </DialogActions>
    </Dialog>
  );
}
