import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";
import FriendListWidget from "scenes/widgets/FriendListWidget";

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id, picturePath, cvPath } = useSelector((state) => state.user);

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        maxWidth="1500px"
        padding="2.5rem 5%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        mx="auto"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreens ? "22%" : undefined}>
          <UserWidget userId={_id} picturePath={picturePath} cvPath={cvPath} />
        </Box>

        <Box
          flexBasis={isNonMobileScreens ? "50%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <MyPostWidget picturePath={picturePath} />
          <Box mt="1.5rem">
            <PostsWidget userId={_id} />
          </Box>
        </Box>

        {isNonMobileScreens && (
          <Box
            flexBasis="24%"
            position="sticky"
            top="100px"
            alignSelf="flex-start"
          >
            <AdvertWidget />
            <Box m="2rem 0" />
            <FriendListWidget userId={_id} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HomePage;
