import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";

import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Card, CardContent, Typography, Box, List, ListItem, ListItemText } from "@mui/material";
import { Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import FlexBetween from "components/FlexBetween";



// Configura moment para el calendario
const localizer = momentLocalizer(moment);

const UserAppointments = ({ userId }) => {
    const [appointments, setAppointments] = useState([]);
    const token = useSelector((state) => state.token);
    const dispatch = useDispatch();




    const getAppointments = async () => {
        try {
            const response = await fetch(
                `http://localhost:3001/appointments/${userId}/appointments`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,

                },

            });
            const appointments = await response.json();
            setAppointments(appointments);



        } catch (err) {
            console.error('Error fetching appointments:', err);
            return [];

        }


    };

    useEffect(() => {
        getAppointments();
    }, []);


    // const events = appointments.map((appointment) => ({
    //     title: `${appointment.reason} (Con: ${appointment.receiver.firstName} ${appointment.receiver.lastName})`,
    //     start: new Date(`${appointment.date}T${appointment.time}`),
    //     resourceId: appointment._id,
    // }));



    return (
        <FlexBetween>
            <Box display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                width="80%"
                margin="auto"
                marginTop="40px"
                padding="20px"
                borderRadius="8px"
                marginBottom="40px">
                <>
                    <Box>
                        <Typography variant="h4" gutterBottom>Mis citas</Typography>
                    </Box>

                    {appointments.length === 0 ? (
                        <Typography variant="body1">No tienes citas programadas</Typography>
                    ) : (

                        <Table style={{ width: '100%' }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ width: '25%', height: '40px', textAlign: 'center', verticalAlign: 'middle', borderBottom: '2px solid lightblue' }}>Fecha</TableCell>
                                    <TableCell style={{ width: '25%', height: '40px', textAlign: 'center', verticalAlign: 'middle', borderBottom: '2px solid lightblue' }} >Hora</TableCell>
                                    <TableCell style={{ width: '25%', height: '40px', textAlign: 'center', verticalAlign: 'middle', borderBottom: '2px solid lightblue' }} >Razón</TableCell>
                                    <TableCell style={{ width: '25%', height: '40px', textAlign: 'center', verticalAlign: 'middle', borderBottom: '2px solid lightblue' }} >Mentor</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {appointments.map((appointment) => (
                                    <TableRow key={appointment._id}>
                                        <TableCell style={{ width: '25%', height: '40px', textAlign: 'center', verticalAlign: 'middle', borderBottom: '2px solid lightblue' }} >{new Date(appointment.date).toLocaleDateString()}</TableCell>
                                        <TableCell style={{ width: '25%', height: '40px', textAlign: 'center', verticalAlign: 'middle', borderBottom: '2px solid lightblue' }} >{appointment.time}</TableCell>
                                        <TableCell style={{ width: '25%', height: '40px', textAlign: 'center', verticalAlign: 'middle', borderBottom: '2px solid lightblue' }} >{appointment.reason}</TableCell>
                                        <TableCell style={{ width: '25%', height: '40px', textAlign: 'center', verticalAlign: 'middle', borderBottom: '2px solid lightblue' }} >{appointment.receiver.firstName} {appointment.receiver.lastName}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        /* <List>
                            {appointments.map((appointment) => (
                                <ListItem key={appointment._id}>
                                    <Card variant="outlined" sx={{ width: '100%' }}>
                                        <CardContent>
                                            <Typography variant="h6">Cita programada</Typography>
                                            <Typography variant="body1">
                                                Fecha: {new Date(appointment.date).toLocaleDateString()}
                                            </Typography>
                                            <Typography variant="body1">
                                                Hora: {appointment.time}
                                            </Typography>
                                            <Typography variant="body1">
                                                Razón: {appointment.reason}
                                            </Typography>
                                            <Typography variant="body1">
                                                Mentor: {appointment.receiver.firstName} {appointment.receiver.lastName}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </ListItem>
                            ))}
                        </List> */


                    )}
                </>
            </Box>
        </FlexBetween>
    );


    // return (
    //     <div>
    //         <h1>Mis citas</h1>
    //         {appointments.length === 0 ? (
    //             <p>No tienes citas programadas</p>
    //         ) : (
    //             <Calendar
    //                 localizer={localizer}
    //                 events={events}
    //                 title= "title"
    //                 startAccessor="start"
    //                 endAccessor="end"
    //                 defaultView="month"
    //                 views={['month', 'week', 'day']}
    //                 style={{ height: 500, width: '100%' }}
    //             />
    //         )}
    //     </div>
    // );

}


export default UserAppointments;