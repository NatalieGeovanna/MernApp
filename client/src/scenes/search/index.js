import { Box, useMediaQuery } from "@mui/material";
import Navbar from "scenes/navbar";
import UserListWidget from "scenes/widgets/UserListWidget";
import { useLocation } from "react-router-dom";

const Search = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { search } = useLocation();
  const query = new URLSearchParams(search).get("q") || "";

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box
          flexBasis={isNonMobileScreens ? "100%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <UserListWidget searchTerm={query} />
        </Box>
      </Box>
    </Box>
  );
};

export default Search;
