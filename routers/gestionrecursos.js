const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/gestionrecursos.json');

const leerRecursos = () => {
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


const escribirRecursos = (recursos) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(recursos, null, 2));
    } catch (err) {
        console.error('Error al escribir en el archivo JSON:', err);
    }
};


router.get('/', (req, res) => {
    const gestionrecursos = leerRecursos();
    res.json(gestionrecursos);
});

router.post('/', (req, res) => {
    const gestionrecursos = leerRecursos();
    const nuevoRecurso = req.body;
    gestionrecursos.push(nuevoRecurso);
    escribirRecursos(gestionrecursos);
    res.status(201).json(nuevoRecurso);
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const gestionrecursos = leerRecursos();
    const index = gestionrecursos.findIndex(r => r.Id === parseInt(id));

    if (index !== -1) {
        const updatedRecurso = { ...gestionrecursos[index], ...req.body };
        gestionrecursos[index] = updatedRecurso;
        escribirRecursos(gestionrecursos);
        res.status(200).json(updatedRecurso);
    } else {
        res.status(404).json({ message: `Recurso con Id ${id} no encontrado` });
    }
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const gestionrecursos = leerRecursos();
    const index = gestionrecursos.findIndex(r => r.Id === parseInt(id));

    if (index !== -1) {
        gestionrecursos.splice(index, 1);
        escribirRecursos(gestionrecursos);
        res.status(200).json({ message: `Recurso con Id ${id} eliminado` });
    } else {
        res.status(404).json({ message: `Recurso con Id ${id} no encontrado` });
    }
});

module.exports = router;
