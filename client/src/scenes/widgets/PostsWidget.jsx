import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostWidget from "./PostWidget";
import { Box, Typography } from "@mui/material";
import FeedOutlinedIcon from "@mui/icons-material/FeedOutlined";
const PostsWidget = ({ userId, isProfile = false }) => {
  const currentUserId = useSelector((state) => state.user._id);
  const isOwnProfile = currentUserId === userId;
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

  const getPosts = async () => {
    console.log("Llamando al feed...");
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/posts/feed/${userId}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };

  const getUserPosts = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/posts/${userId}/posts`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    console.log(response.status);
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (posts.length === 0) {
    return (
      <Box
        mt="2rem"
        p="3rem"
        textAlign="center"
        borderRadius="1rem"
        bgcolor="background.paper"
        border="1px solid"
        borderColor="divider"
      >
        <FeedOutlinedIcon
          sx={{
            fontSize: 55,
            color: "primary.main",
            mb: 2,
          }}
        />

        <Typography variant="h6" fontWeight={600}>
          {isOwnProfile
            ? "Todavía no has publicado nada"
            : "Esta persona aún no ha publicado"}
        </Typography>

        <Typography color="text.secondary" mt={1}>
          {isOwnProfile
            ? "Comparte tu primera publicación para empezar a conectar con la comunidad."
            : "Cuando publique contenido, aparecerá aquí."}
        </Typography>
      </Box>
    );
  }

  return (
    <>
      {posts.map(
        ({
          _id,
          userId,
          firstName,
          lastName,
          description,
          location,
          picturePath,
          userPicturePath,
          likes,
          comments,
          createdAt,
        }) => (
          <PostWidget
            key={_id}
            postId={_id}
            postUserId={userId}
            name={`${firstName} ${lastName}`}
            description={description}
            location={location}
            picturePath={picturePath}
            userPicturePath={userPicturePath}
            likes={likes}
            comments={comments}
            createdAt={createdAt}
          />
        ),
      )}
    </>
  );
};

export default PostsWidget;
