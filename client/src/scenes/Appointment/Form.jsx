import { Box, TextField, Button, Snackbar, Alert } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const AppointmentForm = ({ users }) => {
  const currentUserId = useSelector((state) => state.user._id);
  const token = useSelector((state) => state.token);

  // Estado para los campos del formulario
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [senderId] = useState(currentUserId);

  // Estado para el ID y el nombre del receptor
  const [receiverId, setReceiver] = useState("");
  const [receiverName, setReceiverName] = useState("");

  // Mensaje de respuesta
  const [message, setMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const receiverParam = queryParams.get("receiver");

    if (receiverParam) {
      setReceiver(receiverParam);

      const receiver = users.find((user) => user._id === receiverParam);

      if (receiver) {
        setReceiverName(receiver.firstName);
      }
    }
  }, [users]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(date);

    if (selectedDate < today) {
      setMessage("La fecha seleccionada debe ser hoy o una fecha futura.");
      setOpenSnackbar(true);
      return;
    }

    try {
      // Verificar disponibilidad
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/appointments/check`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ date, time }),
        },
      );

      const data = await response.json();

      if (data.exists) {
        setMessage(
          "Ya existe una cita programada para esa fecha y hora. Por favor, selecciona otro horario.",
        );
        setOpenSnackbar(true);
        return;
      }

      // Crear cita
      const createResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/appointments/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            date,
            time,
            reason,
            senderId: currentUserId,
            receiverId,
          }),
        },
      );

      const createData = await createResponse.json();

      if (!createResponse.ok) {
        throw new Error(createData.message);
      }

      setMessage(
        "¡Tu cita fue agendada correctamente! Puedes consultar el recordatorio en la sección Mis citas.",
      );

      setOpenSnackbar(true);

      // Limpiar formulario
      setDate("");
      setTime("");
      setReason("");

      // Mantener el mentor si llegó desde su perfil
      const receiverParam = new URLSearchParams(window.location.search).get(
        "receiver",
      );

      if (!receiverParam) {
        setReceiver("");
      }
    } catch (error) {
      console.error(error);

      setMessage("Ocurrió un error al agendar la cita. Inténtalo nuevamente.");

      setOpenSnackbar(true);
    }
  };

  return (
    <FlexBetween>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        width="50%"
        margin="auto"
        marginTop="40px"
        padding="20px"
        border="1px solid #ccc"
        borderRadius="8px"
        marginBottom="40px"
      >
        <>
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <label htmlFor="time">Fecha:</label>
            <TextField
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              fullWidth
              margin="normal"
            />

            <label htmlFor="time">Hora:</label>
            <TextField
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              fullWidth
              margin="normal"
            />

            <label htmlFor="reason">Motivo:</label>
            <TextField
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              fullWidth
              margin="normal"
            />

            <label htmlFor="sender">Emprendedor:</label>
            <TextField
              value={
                users.find((user) => user._id === senderId)?.firstName || ""
              }
              readOnly
              fullWidth
              margin="normal"
            />

            <label htmlFor="receiver">Mentor:</label>
            <TextField
              select
              value={receiverId}
              onChange={(e) => setReceiver(e.target.value)}
              required
              fullWidth
              margin="normal"
              SelectProps={{
                native: true,
              }}
            >
              <option value="">Selecciona Mentor</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.firstName}
                </option>
              ))}
            </TextField>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              style={{ marginTop: "20px" }}
            >
              Agendar Cita
            </Button>
          </form>
        </>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setOpenSnackbar(false)}
        >
          {message}
        </Alert>
      </Snackbar>
    </FlexBetween>
  );
};
export default AppointmentForm;
