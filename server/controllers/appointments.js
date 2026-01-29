import Appointment from "../models/Appointment.js"

//new date 

export const createAppointment = async (req,res) =>{
    try {
        const { date, time, reason, senderId, receiverId } = req.body;
        const appointment = new Appointment({ date, time, reason, sender: senderId, receiver: receiverId });
        await appointment.save();
        res.status(201).json({ message: '¡Cita creada exitosamente!', appointment })
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
}


// Controlador para obtener las citas del usuario logueado
export const getUserAppointments = async (req, res) => {
    try {
        // Obtén el ID del usuario logueado de la solicitud (supongamos que estás usando JWT)
        const { userId } = req.params;

        // Consulta las citas donde el usuario es el remitente o el receptor
        const appointments = await Appointment.find({
            $or: [
                { sender: userId },
                { receiver: userId }
            ]
        }).populate('sender receiver');

        // Envía las citas como respuesta
        res.json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ error: 'Error fetching appointments' });
    }
};


export const checkAppointment = async (req, res) => {
    try {
        const { date, time } = req.body;

        // Verificar si ya existe una cita en la misma fecha y hora
        const existingAppointment = await Appointment.findOne({ date, time });
        
        // Si ya existe una cita, responder con un mensaje indicando que no está disponible
        if (existingAppointment) {
            return res.json({ exists: true });
        }

        // Si no existe una cita, responder con un mensaje indicando que está disponible
        res.json({ exists: false });
    } catch (error) {
        console.error('Error al verificar la disponibilidad de la cita:', error);
        res.status(500).json({ message: 'Error al verificar la disponibilidad de la cita.' });
    }
};