import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  Alert,
} from "@mui/material";
import { auth, db, storage } from "../../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useTheme } from "@mui/material/styles";
import { FirebaseError } from "firebase/app";

import colors from "../../assets/styles/colors";
import InputField from "../../components/InputField";
import RadioButtonGroup from "../../components/RadioButtonGroup";
import FileUploadButton from "../../components/FileUploadButton";
import { LinkButton, SubmitButton } from "../../components/CustomButton";

export default function AuthModal({ open, onClose, onAuthSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [bio, setBio] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarLink, setAvatarLink] = useState("");
  const [uploadMethod, setUploadMethod] = useState("file");

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleInputChange = (setter) => (e) => setter(e.target.value);

  const handleClose = () => {
    setEmail("");
    setPassword("");
    setNickname("");
    setBio("");
    setAvatarFile(null);
    setAvatarLink("");
    setUploadMethod("file");
    setErrors({});
    setLoading(false);
    onClose();
  };

  const validate = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = "Please enter a valid email";
      }
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password should be at least 6 characters";
    }

    if (isRegister) {
      if (!nickname.trim()) {
        newErrors.nickname = "Nickname is required";
      } else if (nickname.length > 20) {
        newErrors.nickname = "Nickname should be less than 20 characters";
      } else if (/[<>]/.test(nickname)) {
        newErrors.nickname = "Nickname contains invalid characters";
      }
    }

    if (uploadMethod === "link" && avatarLink.trim()) {
      try {
        new URL(avatarLink.trim());
      } catch {
        newErrors.avatarLink = "Please enter a valid URL";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadAvatar = async () => {
    if (uploadMethod === "file" && avatarFile) {
      const avatarRef = ref(
        storage,
        `avatars/${Date.now()}-${avatarFile.name}`
      );
      await uploadBytes(avatarRef, avatarFile);
      return await getDownloadURL(avatarRef);
    } else if (uploadMethod === "link" && avatarLink.trim()) {
      return avatarLink.trim();
    }
    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      let userCredential;

      if (isRegister) {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const avatarUrl = await uploadAvatar();

        await setDoc(doc(db, "users", userCredential.user.uid), {
          email,
          nickname,
          bio,
          avatar: avatarUrl,
          newsIds: [],
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }

      handleClose();

      if (onAuthSuccess) {
        onAuthSuccess();
      }
    } catch (error) {
      console.error("Auth error:", error);

      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/email-already-in-use":
            setErrors({ general: "This email is already in use." });
            break;
          case "auth/invalid-email":
            setErrors({ general: "Invalid email address." });
            break;
          case "auth/user-not-found":
          case "auth/wrong-password":
            setErrors({ general: "Incorrect email or password." });
            break;
          case "auth/weak-password":
            setErrors({ general: "Password is too weak." });
            break;
          default:
            setErrors({ general: error.message });
        }
      } else {
        setErrors({ general: "Something went wrong. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: isMobile ? "90%" : 500,
          maxHeight: "95vh",
          borderRadius: 4,
          boxShadow: 10,
          bgcolor: colors.backgroundColor,
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
          paddingBottom: 0,
        }}
      >
        {isRegister ? "Create Account" : "Welcome Back"}
      </DialogTitle>

      <form onSubmit={handleSubmit}>
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
            label="Email"
            value={email}
            onChange={handleInputChange(setEmail)}
            fullWidth
            error={Boolean(errors.email)}
            helperText={errors.email}
          />

          <InputField
            label="Password"
            type="password"
            value={password}
            onChange={handleInputChange(setPassword)}
            fullWidth
            error={Boolean(errors.password)}
            helperText={errors.password}
          />

          {isRegister && (
            <>
              <InputField
                label="Nickname"
                value={nickname}
                onChange={handleInputChange(setNickname)}
                fullWidth
                error={Boolean(errors.nickname)}
                helperText={errors.nickname}
              />
              <InputField
                label="Bio"
                multiline
                minRows={2}
                value={bio}
                onChange={handleInputChange(setBio)}
                fullWidth
              />

              <RadioButtonGroup
                row
                value={uploadMethod}
                onChange={handleInputChange(setUploadMethod)}
                options={[
                  { label: "Upload File", value: "file" },
                  { label: "Use Link", value: "link" },
                ]}
              />

              {uploadMethod === "file" && (
                <FileUploadButton
                  onFileSelect={setAvatarFile}
                  selectedFile={avatarFile}
                />
              )}

              {uploadMethod === "link" && (
                <InputField
                  label="Avatar Link"
                  value={avatarLink}
                  onChange={handleInputChange(setAvatarLink)}
                  fullWidth
                  error={Boolean(errors.avatarLink)}
                  helperText={errors.avatarLink}
                />
              )}
            </>
          )}

          {errors.general && (
            <Alert severity="error" sx={{ mt: -1 }}>
              {errors.general}
            </Alert>
          )}
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-between", px: 4, pb: 3 }}>
          <LinkButton
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setErrors({});
            }}
            disabled={loading}
          >
            {isRegister ? "Have an account? Login" : "No account? Register"}
          </LinkButton>

          <SubmitButton type="submit" disabled={loading}>
            {loading ? "Please wait..." : isRegister ? "Register" : "Login"}
          </SubmitButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}
