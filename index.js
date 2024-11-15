const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
const PORT = 5000;

let listadoAlumnos = [{}];

app.use(express.json());

const salaRoutes = require('./routers/sala');
const recursosRoutes = require('./routers/gestionrecursos');
const reservasRoutes = require('./routers/gestionreservas');
const usuarioRoutes = require('./routers/usuario');

app.use('/api/sala', salaRoutes);
app.use('/api/recursos', recursosRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/usuario', usuarioRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`);
});
