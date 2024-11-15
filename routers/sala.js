const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/salas.json');

const leerSalas = () => {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
};

const escribirSalas = (salas) => {
    fs.writeFileSync(filePath, JSON.stringify(salas, null, 2));
};

router.get('/', (req, res) => {
    const salas = leerSalas();
    res.json(salas);
});

router.post('/', (req, res) => {
    const salas = leerSalas();
    const nuevaSala = req.body;
    salas.push(nuevaSala);
    escribirSalas(salas);
    res.status(201).json(nuevaSala);
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const salas = leerSalas();
    const index = salas.findIndex(s => s.id === parseInt(id));

    if (index !== -1) {
        salas[index] = { ...salas[index], ...req.body };
        escribirSalas(salas);
        res.status(200).json(salas[index]);
    } else {
        res.status(404).json({ message: `Sala con id ${id} no encontrada` });
    }
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const salas = leerSalas();
    const index = salas.findIndex(s => s.id === parseInt(id));

    if (index !== -1) {
        salas.splice(index, 1);
        escribirSalas(salas);
        res.status(200).json({ message: `Sala con id ${id} eliminada` });
    } else {
        res.status(404).json({ message: `Sala con id ${id} no encontrada` });
    }
});

module.exports = router;
