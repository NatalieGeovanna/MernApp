import React, { useState } from 'react';

function Encuesta() {
  const [respuestas, setRespuestas] = useState({
    claridad: '',
    abordadas: '',
    duracion: '',
    recursos: '',
    satisfaccion: '',
    temas: '',
    comentarios: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRespuestas(prevRespuestas => ({
      ...prevRespuestas,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí podrías enviar las respuestas a través de una solicitud HTTP o realizar cualquier otra acción que necesites
    console.log('Respuestas enviadas:', respuestas);
  };

  return (
    <div>
      <h1>Encuesta de Retroalimentación Post-Cita</h1>
      <form onSubmit={handleSubmit}>
        <ol>
          <li>
            <label>1. ¿Cómo calificarías la claridad de las explicaciones proporcionadas durante la sesión?</label><br />
            <input type="text" name="claridad" value={respuestas.claridad} onChange={handleChange} />
          </li>
          <li>
            <label>2. ¿En qué medida sentiste que se abordaron tus preguntas y preocupaciones durante la sesión?</label><br />
            <input type="text" name="abordadas" value={respuestas.abordadas} onChange={handleChange} />
          </li>
          <li>
            <label>3. ¿La duración de la sesión fue adecuada para cubrir los temas discutidos?</label><br />
            <input type="text" name="duracion" value={respuestas.duracion} onChange={handleChange} />
          </li>
          <li>
            <label>4. ¿Qué tan útiles fueron los recursos compartidos durante la sesión?</label><br />
            <input type="text" name="recursos" value={respuestas.recursos} onChange={handleChange} />
          </li>
          <li>
            <label>5. En una escala del 1 al 10, ¿cuál es tu nivel de satisfacción general con la sesión de mentoría?</label><br />
            <input type="number" name="satisfaccion" min="1" max="10" value={respuestas.satisfaccion} onChange={handleChange} />
          </li>
          <li>
            <label>6. ¿Hubo algún tema específico que te gustaría abordar en futuras sesiones de mentoría?</label><br />
            <textarea name="temas" value={respuestas.temas} onChange={handleChange} />
          </li>
          <li>
            <label>7. ¿Alguna sugerencia o comentario adicional que quieras compartir para mejorar nuestras futuras interacciones?</label><br />
            <textarea name="comentarios" value={respuestas.comentarios} onChange={handleChange} />
          </li>
        </ol>
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}

export default Encuesta;
