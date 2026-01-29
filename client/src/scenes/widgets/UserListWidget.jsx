import {
  Box,
  Typography,
  Divider,
  useTheme,
  Select,
  MenuItem,
} from "@mui/material";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { blue } from "@mui/material/colors";
import UserCard from "./UserCard";

const UserListWidget = ({ searchTerm }) => {
  const [users, setUsers] = useState([]);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;
  const currentUserId = useSelector((state) => state.user._id); // Obtener el userId del usuario logueado
  const [selectedRole, setSelectedRole] = useState(""); // Estado para el rol seleccionado

  const getUsers = async () => {
    const response = await fetch(`http://localhost:3001/users`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const users = await response.json();
    setUsers(users);
  };

  useEffect(() => {
    getUsers();
  }, []);

  // Manejar el cambio de selección del rol
  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  // Filtrar los usuarios según el rol seleccionado
  // const filteredUsers = selectedRole
  //   ? users.filter((user) => user.rol === selectedRole && user._id !== currentUserId)
  //   : users.filter((user) => user._id !== currentUserId);

  const filteredUsers = users
    // excluir usuario logueado
    .filter((user) => user._id !== currentUserId)

    // filtro por rol
    .filter((user) => (selectedRole ? user.rol === selectedRole : true))

    // filtro por texto (live)
    .filter((user) => {
      if (!searchTerm) return true;

      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    });

  return (
    <WidgetWrapper>
      <Box>
        {/* Desplegable para seleccionar el rol */}
        <Select
          value={selectedRole}
          onChange={handleRoleChange}
          displayEmpty
          variant="outlined"
          sx={{ marginBottom: "1rem" }}
        >
          <MenuItem value="">Todos los roles</MenuItem>{" "}
          {/* Opción para mostrar todos los usuarios */}
          {/* Puedes agregar más opciones de rol según sea necesario */}
          <MenuItem value="Mentor">Mentor</MenuItem>
          <MenuItem value="Emprendedor">Emprendedor</MenuItem>
          {/* Agrega más roles según sea necesario */}
        </Select>

        <Typography variant="body2" color="text.secondary">
          {selectedRole && `Rol: ${selectedRole}`}
          {selectedRole && searchTerm && " • "}
          {searchTerm && `Búsqueda: "${searchTerm}"`}
        </Typography>

        {filteredUsers.map(
          ({
            _id,
            firstName,
            lastName,
            occupation,
            location,
            rol,
            picturePath,
          }) => (
            <UserCard
              picturePath={picturePath}
              key={_id}
              name={`${firstName} ${lastName}`}
              location={location}
              occupation={occupation}
              rol={rol}
              userId={_id}
            />
          ),
        )}
      </Box>
    </WidgetWrapper>
  );
};

export default UserListWidget;
