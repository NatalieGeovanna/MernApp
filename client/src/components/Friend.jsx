import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends } from "state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";

const Friend = ({ friendId, name, subtitle, userPicturePath, createdAt }) => {
  const currentUserId = useSelector((state) => state.user._id); // Obtener el userId del usuario logueado
  const isOwnProfile = currentUserId === friendId;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const isFriend = friends.some((friend) => friend._id === friendId);
  console.log("Mis amigos:", friends);
  console.log("friendId:", friendId);

  const patchFriend = async () => {
    const response = await fetch(
      `http://localhost:3001/users/${_id}/${friendId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    const data = await response.json();
    console.log(data);
    dispatch(setFriends({ friends: data }));
    navigate(0);
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const postDate = new Date(date);

    const seconds = Math.floor((now - postDate) / 1000);

    if (seconds < 60) return "Hace un momento";

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `Hace ${minutes} min`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Hace ${hours} h`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `Hace ${days} día${days > 1 ? "s" : ""}`;

    return postDate.toLocaleDateString("es-CO", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        <UserImage image={userPicturePath} size="55px" />
        <Box
          onClick={() => {
            navigate(`/profile/${friendId}`);
            navigate(0);
          }}
        >
          <Typography
            color={main}
            fontWeight={600}
            fontSize="1rem"
            sx={{
              "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              },
            }}
          >
            {name}
          </Typography>
          <Typography color={medium} fontSize="0.75rem">
            {subtitle} • {formatTimeAgo(createdAt)}
          </Typography>
        </Box>
      </FlexBetween>

      {!isOwnProfile && (
        <IconButton
          onClick={() => patchFriend()}
          sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
        >
          {isFriend ? (
            <PersonRemoveOutlined sx={{ color: primaryDark }} />
          ) : (
            <PersonAddOutlined sx={{ color: primaryDark }} />
          )}
        </IconButton>
      )}
    </FlexBetween>
  );
};

export default Friend;
