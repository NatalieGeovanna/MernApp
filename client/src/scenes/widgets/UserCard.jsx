
import WidgetWrapper from 'components/WidgetWrapper';
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import UserImage from 'components/UserImage';
import FlexBetween from 'components/FlexBetween';
import { useNavigate } from "react-router-dom";
import { setFriends } from "state";


const UserCard = ({ name, location, occupation, picturePath, userId, rol }) => {
    const { palette } = useTheme();
    const primaryLight = palette.primary.light;
    const primaryDark = palette.primary.dark;
    const main = palette.neutral.main;
    const medium = palette.neutral.medium;
    const navigate = useNavigate();
    



    return (


        <FlexBetween m="5rem">
            <Box
            sx={{
                        
                        
                        cursor: "pointer",
                    }}
                onClick={() => {
                    navigate(`/profile/${userId}`);
                    navigate(0);
                }}
            >
                <FlexBetween gap="1rem">
                    <UserImage image={picturePath} size="55px" />
                    <Box
                        onClick={() => {
                            navigate(`/profile/${userId}`);
                            navigate(0);
                        }}>
                        <Typography color={main}
                            variant="h5"
                            fontWeight="500"
                            sx={{
                                "&:hover": {
                                    color: palette.primary.light,
                                    cursor: "pointer",
                                },
                            }}>{name}</Typography>
                        <Typography color={medium} fontSize="0.75rem">{location}</Typography>
                        <Typography color={medium} fontSize="0.75rem">{occupation}</Typography>
                        <Typography color={medium} fontSize="0.75rem">{rol}</Typography>
                    </Box>


                </FlexBetween>
            </Box>
        </FlexBetween>


    );
};

export default UserCard;