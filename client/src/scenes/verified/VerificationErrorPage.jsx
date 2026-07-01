import { ErrorOutline } from "@mui/icons-material";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

const VerificationErrorPage = () => {
  const navigate = useNavigate();
  const { palette } = useTheme();

  return (
    <Box
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor={palette.background.default}
    >
      <Box
        textAlign="center"
        p={5}
        borderRadius={4}
        bgcolor={palette.background.alt}
        boxShadow={3}
        maxWidth={500}
      >
        <ErrorOutline
          sx={{
            fontSize: 90,
            color: palette.error.main,
            mb: 2,
          }}
        />

        <Typography variant="h4" fontWeight="bold" mb={2}>
          Enlace inválido
        </Typography>

        <Typography color="text.secondary" mb={4}>
          Este enlace ya expiró o no es válido.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/")}
        >
          Volver al inicio
        </Button>
      </Box>
    </Box>
  );
};

export default VerificationErrorPage;
