import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Container,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthModal from "../../modals/AuthModal";
import { auth, db } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import NavButton from "../NavButton";
import logo from "../../assets/images/logo.png";
import colors from "../../assets/styles/colors.js";

export default function Header() {
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const navigate = useNavigate();
  const location = useLocation();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData(data);
          } else {
            console.log("No user doc found");
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleOpenAuthModal = () => setOpenAuthModal(true);
  const handleCloseAuthModal = () => setOpenAuthModal(false);
  const handleAvatarClick = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleProfile = () => {
    handleCloseMenu();
    if (user) navigate(`/profile/${user.uid}`);
  };

  const handleLogout = async () => {
    handleCloseMenu();
    await signOut(auth);
    navigate("/");
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={3}
        sx={{ backgroundColor: colors.mainColor }}
      >
        <Toolbar disableGutters>
          <Container
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: isMobile ? "nowrap" : "wrap",
              gap: isMobile ? "12px" : "8px",
              py: "8px",
            }}
          >
            <Box
              component={Link}
              to="/"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                textDecoration: "none",
                color: colors.textColor,
                flexShrink: 0,
              }}
            >
              <Box
                component="img"
                src={logo}
                alt="NewsPortal Logo"
                sx={{ width: 70, height: 50 }}
              />
              {!isMobile && (
                <Typography
                  variant="h6"
                  noWrap
                  sx={{
                    fontWeight: 700,
                    fontSize: "1.5rem",
                    letterSpacing: "1px",
                    whiteSpace: "nowrap",
                  }}
                >
                  NewsPortal
                </Typography>
              )}
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                flexWrap: "nowrap",
                overflowX: isMobile ? "auto" : "visible",
                maxWidth: isMobile ? "calc(100vw - 100px)" : "auto",
              }}
            >
              {["search", "agency"].map((route) => {
                const isActive = location.pathname.startsWith(`/${route}`);
                return (
                  <NavButton
                    key={route}
                    component={Link}
                    to={`/${route}`}
                    isActive={isActive}
                  >
                    {route.charAt(0).toUpperCase() + route.slice(1)}
                  </NavButton>
                );
              })}

              {user ? (
                <>
                  <Avatar
                    src={userData?.avatar || ""}
                    alt={userData?.nickname || "User Avatar"}
                    onClick={handleAvatarClick}
                    sx={{
                      cursor: "pointer",
                      width: 36,
                      height: 36,
                      ml: 1,
                      border: `2px solid ${colors.borderColor}`,
                    }}
                    aria-controls={openMenu ? "user-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={openMenu ? "true" : undefined}
                  />
                  <Menu
                    id="user-menu"
                    anchorEl={anchorEl}
                    open={openMenu}
                    onClose={handleCloseMenu}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                    PaperProps={{
                      elevation: 3,
                      sx: {
                        mt: 1,
                        backgroundColor: colors.mainColor,
                        border: `3px solid ${colors.hoverColor}`,
                        borderRadius: "12px",
                        minWidth: 120,
                        paddingY: 0.5,
                        transition: "all 0.2s ease-in-out",
                      },
                    }}
                  >
                    <MenuItem onClick={handleProfile} sx={menuItemStyle}>
                      Profile
                    </MenuItem>
                    <MenuItem onClick={handleLogout} sx={menuItemStyle}>
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  onClick={handleOpenAuthModal}
                  color="secondary"
                  variant="outlined"
                  sx={{
                    ml: 1,
                    color: colors.textColor,
                    border: `2px solid ${colors.borderColor}`,
                    "&:hover": {
                      backgroundColor: colors.hoverColor,
                      borderColor: colors.hoverColor,
                    },
                  }}
                >
                  Log / Reg
                </Button>
              )}
            </Box>
          </Container>
        </Toolbar>
      </AppBar>

      <AuthModal
        open={openAuthModal}
        onClose={handleCloseAuthModal}
        onAuthSuccess={() => {
          navigate("/");
        }}
      />
    </>
  );
}

const menuItemStyle = {
  fontSize: "1rem",
  fontWeight: 500,
  color: colors.textColor,
  px: 2,
  py: 1.25,
  transition: "background-color 0.2s ease",
  "&:hover": {
    backgroundColor: colors.hoverColor,
    fontSize: "1.05rem",
  },
};
