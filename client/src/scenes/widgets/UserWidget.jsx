import {
  ManageAccountsOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
  PersonOutlineOutlined,
} from "@mui/icons-material";
import { Box, Typography, Divider, useTheme, Button } from "@mui/material";
import UserImage from "components/UserImage";
// import UserFile from "components/UserFile";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { setFriends } from "state";

const UserWidget = ({ userId, picturePath, cvPath }) => {
  const { _id } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;
  const currentUserId = useSelector((state) => state.user._id); // Obtener el userId del usuario logueado
  const isOwnProfile = currentUserId === userId;
  const loggedInUserFriends = useSelector((state) => state.user.friends);

  const getUser = useCallback(async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/users/${userId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();
    setUser(data);
  }, [userId, token]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  if (!user) {
    return null;
  }

  const { firstName, lastName, location, occupation, rol } = user;
  const isFriend = loggedInUserFriends.some((friend) => friend._id === userId);

  const handleClick = () => {
    // Redirige a la página de citas con el `userId` como argumento
    navigate(`/appointments?receiver=${userId}`);
  };

  const patchFriend = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/users/${_id}/${userId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    const data = await response.json();
    dispatch(setFriends({ friends: data }));
    await getUser();
  };

  return (
    <WidgetWrapper>
      {/* FIRST ROW */}
      <FlexBetween
        gap="0.5rem"
        pb="1.1rem"
        onClick={() => navigate(`/profile/${userId}`)}
      >
        <FlexBetween gap="1rem">
          <UserImage image={picturePath} />
          <Box>
            <Typography
              variant="h4"
              color={dark}
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                  cursor: "pointer",
                },
              }}
            >
              {firstName} {lastName}
            </Typography>
            <Typography color={medium}>
              {user.friends.length} friends
            </Typography>
          </Box>
        </FlexBetween>

        {isOwnProfile ? (
          <IconButton
            sx={{
              backgroundColor: palette.primary.light,
              p: "0.6rem",
            }}
          >
            <ManageAccountsOutlined sx={{ color: palette.primary.dark }} />
          </IconButton>
        ) : (
          <IconButton
            onClick={patchFriend}
            sx={{
              backgroundColor: palette.primary.light,
              p: "0.6rem",
            }}
          >
            {isFriend ? (
              <PersonRemoveOutlined sx={{ color: palette.primary.dark }} />
            ) : (
              <PersonAddOutlined sx={{ color: palette.primary.dark }} />
            )}
          </IconButton>
        )}
      </FlexBetween>

      <Divider />

      {/* SECOND ROW */}
      <Box p="1rem 0">
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <PersonOutlineOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{rol}</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <LocationOnOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{location}</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{occupation}</Typography>
        </Box>
        {/* <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <ArticleOutlined fontSize="large" sx={{ color: main }} />
          <UserFile file={cvPath} rol={rol} />
        </Box> */}
      </Box>

      <Divider />

      {/* OCULTAR BOTÓN SI EL PERFIL MOSTRADO ES EL DEL USUARIO LOGUEADO */}
      {currentUserId !== userId && user.rol === "Mentor" && (
        <Box p="1rem 0" textAlign="center">
          <Button onClick={handleClick}>Agendar una cita</Button>
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default UserWidget;
