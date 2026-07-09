import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Form from "./Form";
import { useState } from "react";
import { Button } from "@mui/material";

const LoginPage = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery("(min-width:1280px)");
  const [pageType, setPageType] = useState("login");
  const [activeStep, setActiveStep] = useState(1);
  const { palette } = useTheme();

  const wizardButtonStyle = {
    mt: 2,
    p: "1rem",
    borderRadius: "12px",
    textTransform: "none",
    fontWeight: 600,
    backgroundColor: palette.primary.main,
    color: "#fff",
    boxShadow: "none",
    transition: "all .2s ease",

    "&:hover": {
      backgroundColor: palette.primary.dark,
      transform: "translateY(-2px)",
      boxShadow: "0 8px 20px rgba(25,118,210,.25)",
    },

    "&:active": {
      transform: "translateY(0)",
      boxShadow: "0 3px 10px rgba(25,118,210,.18)",
    },
  };

  return (
    <Box>
      <Box
        width="100%"
        backgroundColor={theme.palette.background.alt}
        px="6%"
        py="1rem"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography
          fontWeight="bold"
          fontSize="32px"
          color="primary"
          sx={{
            cursor: "pointer",
            "&:hover": {
              opacity: 0.9,
            },
          }}
          onClick={() => {
            setPageType("login");
            setActiveStep(1);
          }}
        >
          Mentify
        </Typography>

        {isDesktop && (
          <Button
            variant="contained"
            disableElevation
            onClick={() => {
              if (pageType === "login") {
                setPageType("register");
              } else {
                setPageType("login");
              }
              setActiveStep(1);
            }}
            sx={wizardButtonStyle}
          >
            {pageType === "login" ? "Crear cuenta" : "Iniciar sesión"}
          </Button>
        )}
      </Box>

      <Box
        sx={{
          width: "100%",
          maxWidth: isDesktop ? 1280 : 560,
          mx: "auto",
          my: { xs: 2, lg: 4 },
          px: { xs: 2, sm: 3, lg: 4 },
          py: isDesktop ? 0 : 3,
          borderRadius: isDesktop ? 0 : "1.5rem",
          backgroundColor: isDesktop
            ? "transparent"
            : theme.palette.background.alt,
          boxSizing: "border-box",
        }}
      >
        {!isDesktop && (
          <Typography
            fontWeight="500"
            variant="h5"
            sx={{ mb: "1.5rem", textAlign: "center" }}
          >
            Conecta con mentores y emprendedores de toda Colombia
          </Typography>
        )}

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
