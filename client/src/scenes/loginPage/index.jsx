import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Form from "./Form";
import { useState } from "react";

const LoginPage = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const [pageType, setPageType] = useState("login");
  const [activeStep, setActiveStep] = useState(1);

  return (
    <Box>
      <Box
        width="100%"
        backgroundColor={theme.palette.background.alt}
        p="1rem 6%"
        textAlign="center"
      >
        <Box
          onClick={() => {
            setPageType("login");
            setActiveStep(1);
          }}
          sx={{
            display: "inline-block",
            cursor: "pointer",
            transition: "0.2s",

            "&:hover": {
              transform: "scale(1.03)",
              opacity: 0.9,
            },
          }}
        >
          <Typography fontWeight="bold" fontSize="32px" color="primary">
            Mentify
          </Typography>
        </Box>
      </Box>

      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
      >
        <Typography
          fontWeight="500"
          variant="h5"
          sx={{ mb: "1.5rem", textAlign: "center" }}
        >
          Conecta con mentores y emprendedores de toda Colombia
        </Typography>
        <Form
          pageType={pageType}
          setPageType={setPageType}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
        />
      </Box>
    </Box>
  );
};

export default LoginPage;
