import { Box, Typography, CircularProgress, useTheme } from "@mui/material";

import { CheckCircleRounded } from "@mui/icons-material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const VerifiedPage = () => {
  const navigate = useNavigate();
  const { palette } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Box
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor={palette.background.default}
    >
      <Box
        bgcolor={palette.background.alt}
        p={5}
        borderRadius={4}
        width={420}
        textAlign="center"
        boxShadow={5}
      >
        <CheckCircleRounded
          sx={{
            fontSize: 90,
            color: palette.success.main,
          }}
        />

        <Typography variant="h4" fontWeight="bold" mt={3}>
          ¡Cuenta verificada!
        </Typography>

        <Typography color="text.secondary" mt={2}>
          Tu correo ha sido confirmado correctamente.
        </Typography>

        <Typography color="text.secondary" mb={4}>
          En unos segundos serás redirigido al inicio de sesión.
        </Typography>

        <CircularProgress />
      </Box>
    </Box>
  );
};

export default VerifiedPage;
