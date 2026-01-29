import React from "react";
import UserAppointments from "scenes/widgets/UserAppointments"; // Asegúrate de importar el componente UserAppointments
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import { useParams } from "react-router-dom";

const CalendarPage = () => {
    const { _id} = useSelector((state) => state.user);
    
    // Obtener el ID del usuario y el token desde el estado de la aplicación o un contexto
   

    return (
        <div>
            <Navbar/>
           
            {/* Llama al componente UserAppointments pasando el userId y token como props */}
            <UserAppointments userId={_id}/>
        </div>
    );
};

export default CalendarPage;
