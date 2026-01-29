import { Box, Button } from "@mui/material";

const UserFile = ({ file, rol }) => {
    // Determina el texto a mostrar dependiendo del rol
  const buttonText = rol === "Mentor" ? "Hoja de vida" : rol === "Emprendedor" ? "Acerca de mi negocio" : "Documento";


  
  return (
      <Box>
          <Button href={`http://localhost:3001/assets/${file}`}>
              {buttonText}
          </Button>
      </Box>
  );
};



export default UserFile;