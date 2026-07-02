import { useState, useEffect, useCallback } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Search, DarkMode, LightMode, Close } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";
import { CalendarMonth } from "@mui/icons-material";
import { Menu, MenuItem, Divider } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import UserImage from "components/UserImage";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const alt = theme.palette.background.alt;

  const fullName = `${user.firstName} `;
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const token = useSelector((state) => state.token);
  const [users, setUsers] = useState([]);

  const getUsers = useCallback(async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const users = await response.json();
    setUsers(users);
  }, [token]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = users
    .filter((u) => u._id !== user._id)
    .filter((u) =>
      `${u.firstName} ${u.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    );

  const menuItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    width: "100%",
    padding: "0.9rem 1rem",
    borderRadius: "12px",
    cursor: "pointer",

    "&:hover": {
      backgroundColor: neutralLight,
    },
  };

  return (
    <FlexBetween
      padding="1.2rem 6%"
      backgroundColor={alt}
      sx={{
        boxShadow: "0 2px 12px rgba(0,0,0,.05)",
      }}
      position="sticky"
      top={0}
      zIndex={1000}
      boxShadow="0 2px 12px rgba(0,0,0,.05)"
    >
      <FlexBetween gap="1.75rem">
        <IconButton
          onClick={() => navigate("/home")}
          sx={{
            color: "primary.main",
            "&:hover": {
              backgroundColor: "transparent",
            },
          }}
        >
          <AutoStoriesOutlinedIcon sx={{ fontSize: 34 }} />
        </IconButton>
        {isNonMobileScreens && (
          <Box position="relative">
            <FlexBetween
              backgroundColor={neutralLight}
              gap="3rem"
              padding="0.1rem 1.5rem"
              width="380px"
              borderRadius="999px"
              px="1rem"
              py="0.3rem"
            >
              <InputBase
                fullWidth
                placeholder="Buscar a alguien..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ px: "0.75rem" }}
              />
              <IconButton
                onClick={() => {
                  console.log("CLICK");
                  console.log(searchTerm);
                  if (!searchTerm.trim()) return;
                  navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
                }}
              >
                <Search />
              </IconButton>

              {searchTerm.trim() && filteredUsers.length > 0 && (
                <Box
                  position="absolute"
                  top="110%"
                  left={0}
                  width="100%"
                  bgcolor={theme.palette.background.paper}
                  borderRadius="12px"
                  boxShadow="0 8px 20px rgba(0,0,0,.12)"
                  zIndex={2000}
                  overflow="hidden"
                >
                  {filteredUsers.slice(0, 5).map((u) => (
                    <Box
                      key={u._id}
                      display="flex"
                      alignItems="center"
                      gap="1rem"
                      p="0.8rem 1rem"
                      sx={{
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: neutralLight,
                        },
                      }}
                      onClick={() => {
                        setSearchTerm("");
                        navigate(`/profile/${u._id}`);
                      }}
                    >
                      <UserImage image={u.picturePath} size="40px" />

                      <Box>
                        <Typography fontWeight={600}>
                          {u.firstName} {u.lastName}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                          {u.occupation}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </FlexBetween>
          </Box>
        )}
      </FlexBetween>

      {/* DESKTOP NAV */}
      {isNonMobileScreens ? (
        <FlexBetween gap="2rem">
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkMode sx={{ fontSize: "25px" }} />
            ) : (
              <LightMode sx={{ color: dark, fontSize: "25px" }} />
            )}
          </IconButton>

          <IconButton onClick={() => navigate(`/calendar`)}>
            <CalendarMonth sx={{ color: dark, fontSize: "25px" }} />
          </IconButton>

          <IconButton onClick={() => navigate("/home")}>
            <HomeOutlinedIcon sx={{ color: dark, fontSize: "25px" }} />
          </IconButton>

          <IconButton>
            <NotificationsNoneOutlinedIcon
              sx={{ color: dark, fontSize: "25px" }}
            />
          </IconButton>

          <FlexBetween>
            <Box>
              <FlexBetween
                gap="0.6rem"
                onClick={handleClick}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  cursor: "pointer",
                  px: "0.8rem",
                  py: "0.4rem",
                  borderRadius: "999px",
                  transition: ".2s",

                  "&:hover": {
                    backgroundColor: neutralLight,
                  },
                }}
              >
                <UserImage image={user.picturePath} size="38px" />

                <Typography fontWeight={500}>{fullName}</Typography>
                <KeyboardArrowDownIcon
                  sx={{
                    color: "text.secondary",
                    fontSize: 22,
                  }}
                />
              </FlexBetween>

              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                  sx: {
                    width: 240,
                    mt: 1,
                    borderRadius: "16px",
                    boxShadow: "0 8px 24px rgba(0,0,0,.12)",
                    p: 1,
                  },
                }}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  gap="0.75rem"
                  px={1.5}
                  py={1.5}
                  onClick={() => {
                    handleClose();
                    navigate(`/profile/${user._id}`);
                  }}
                  sx={{
                    cursor: "pointer",
                    borderRadius: "12px",
                    transition: "0.2s",
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <UserImage image={user.picturePath} size="45px" />

                  <Box>
                    <Typography fontWeight={600}>{fullName}</Typography>

                    <Typography variant="body2" color="text.secondary">
                      Emprendedor
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 1 }} />

                <MenuItem
                  onClick={() => {
                    handleClose();
                    navigate(`/profile/${user._id}`);
                  }}
                >
                  <PersonOutlineOutlinedIcon sx={{ mr: 1.5 }} />
                  Mi perfil
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    handleClose();
                    dispatch(setLogout());
                  }}
                >
                  <LogoutOutlinedIcon sx={{ mr: 1.5 }} />
                  Cerrar sesión
                </MenuItem>
              </Menu>
            </Box>
          </FlexBetween>
        </FlexBetween>
      ) : (
        <IconButton
          onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* MOBILE NAV */}
      {!isNonMobileScreens && isMobileMenuToggled && (
        <Box
          position="fixed"
          right={0}
          top={0}
          width={{
            xs: "100%",
            sm: "320px",
          }}
          maxWidth="85vw"
          height="100vh"
          bgcolor={background}
          zIndex={1200}
          overflowY="auto"
        >
          {/* CLOSE ICON */}
          <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            p="1rem"
          >
            <IconButton
              size="small"
              onClick={() => setIsMobileMenuToggled(false)}
            >
              <Close fontSize="small" />
            </IconButton>
          </Box>

          {/* MENU ITEMS */}
          <FlexBetween display="flex" flexDirection="column" gap="3rem">
            <FlexBetween
              backgroundColor={neutralLight}
              borderRadius="9px"
              gap="3rem"
              padding="2px"
            >
              <InputBase
                placeholder="Buscar a alguien..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ px: "0.75rem" }}
              />
              <IconButton
                onClick={() => {
                  if (!searchTerm.trim()) return;
                  navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
                }}
              >
                <Search />
              </IconButton>
            </FlexBetween>
            <Box sx={menuItemStyle} onClick={() => navigate("/home")}>
              <HomeOutlinedIcon />
              <Typography>Inicio</Typography>
            </Box>

            <Box sx={menuItemStyle} onClick={() => navigate("/calendar")}>
              <CalendarMonth />
              <Typography>Calendario</Typography>
            </Box>

            <Box sx={menuItemStyle}>
              <NotificationsNoneOutlinedIcon />
              <Typography>Notificaciones</Typography>
            </Box>

            <Box sx={menuItemStyle} onClick={() => dispatch(setMode())}>
              {theme.palette.mode === "dark" ? <DarkMode /> : <LightMode />}

              <Typography>Cambiar tema</Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box
              onClick={() => dispatch(setLogout())}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                p: "0.9rem 1rem",
                borderRadius: "12px",
                cursor: "pointer",

                "&:hover": {
                  backgroundColor: neutralLight,
                },
              }}
            >
              <LogoutOutlinedIcon
                sx={{
                  color: theme.palette.primary.main,
                }}
              />
              <Typography
                sx={{
                  color: theme.palette.primary.main,
                  fontWeight: 500,
                }}
              >
                Cerrar sesión
              </Typography>
            </Box>
          </FlexBetween>
        </Box>
      )}
    </FlexBetween>
  );
};

export default Navbar;
