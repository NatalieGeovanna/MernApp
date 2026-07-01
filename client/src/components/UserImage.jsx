import { Box } from "@mui/material";
import { getImageUrl } from "utils/getImageUrl";

const UserImage = ({ image, size = "60px" }) => {
  return (
    <Box width={size} height={size}>
      <img
        src={getImageUrl(image)}
        alt="user"
        width={size}
        height={size}
        style={{
          objectFit: "cover",
          borderRadius: "50%",
        }}
      />
    </Box>
  );
};

export default UserImage;
