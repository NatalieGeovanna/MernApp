import React from "react";
import { Box, Button } from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import AppointmentForm from "./Form";
import Navbar from "scenes/navbar";
import { useNavigate } from "react-router-dom";

const ApointmentPage = () => {
  const [users, setUsers] = useState([]);
  const token = useSelector((state) => state.token);
  const navigate = useNavigate();

  const getUsers = useCallback(async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const users = await response.json();
    setUsers(users);
  }, [token]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <Box>
      <Navbar />
      <AppointmentForm users={users} />
      <Box p="1rem 0" textAlign="center">
        <Button onClick={() => navigate(`/encuesta`)}>Encuesta</Button>
      </Box>
    </Box>
  );
};

export default ApointmentPage;
