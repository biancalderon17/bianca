const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/gestionreservas.json');

const leerReservas = () => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        if (!data) {
            return []; 
        }
        return JSON.parse(data);
    } catch (err) {
        console.error('Error al leer o parsear el archivo JSON:', err);
        return [];
    }
};

const escribirReservas = (reservas) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(reservas, null, 2));
        console.log('Datos escritos correctamente en el archivo JSON.');
    } catch (err) {
        console.error('Error al escribir en el archivo JSON:', err);
    }
};

if (!fs.existsSync(filePath)) {
    escribirReservas([]);
}

router.get('/', (req, res) => {
    const gestionreservas = leerReservas();
    res.json(gestionreservas);
});

router.post('/', (req, res) => {
    const gestionreservas = leerReservas();
    const nuevaReserva = req.body;
    gestionreservas.push(nuevaReserva);
    escribirReservas(gestionreservas);
    res.status(201).json(nuevaReserva);
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const gestionreservas = leerReservas();
    const reservaIndex = gestionreservas.findIndex(reserva => reserva.Id === parseInt(id));

    if (reservaIndex !== -1) {
        const reservaActualizada = { ...gestionreservas[reservaIndex], ...req.body };
        gestionreservas[reservaIndex] = reservaActualizada;
        escribirReservas(gestionreservas);
        res.status(200).json(reservaActualizada);
    } else {
        res.status(404).json({ message: `Reserva con Id ${id} no encontrada` });
    }
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const gestionreservas = leerReservas();
    const reservaIndex = gestionreservas.findIndex(reserva => reserva.Id === parseInt(id));

    if (reservaIndex !== -1) {
        gestionreservas.splice(reservaIndex, 1);
        escribirReservas(gestionreservas);
        res.status(200).json({ message: `Reserva con Id ${id} eliminada` });
    } else {
        res.status(404).json({ message: `Reserva con Id ${id} no encontrada` });
    }
});

module.exports = router;
