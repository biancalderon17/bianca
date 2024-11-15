const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const usuariosFilePath = path.join(__dirname, 'usuarios.json');

const readUsuariosFromFile = () => {
    try {
        const data = fs.readFileSync(usuariosFilePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error al leer el archivo de usuarios:', err);
        return [];
    }
};

const writeUsuariosToFile = (usuarios) => {
    try {
        fs.writeFileSync(usuariosFilePath, JSON.stringify(usuarios, null, 2));
    } catch (err) {
        console.error('Error al escribir en el archivo de usuarios:', err);
    }
};

router.get('/', (req, res) => {
    const usuarios = readUsuariosFromFile();
    res.json(usuarios);
});

router.post('/', (req, res) => {
    const nuevoUsuario = req.body;
    const usuarios = readUsuariosFromFile();
    usuarios.push(nuevoUsuario);
    writeUsuariosToFile(usuarios);
    res.status(201).json(nuevoUsuario); 
});

router.put('/:DNI', (req, res) => {
    const { dni } = req.params;
    const usuarios = readUsuariosFromFile();
    const index = usuarios.findIndex(u => u.DNI === parseInt(dni));

    if (index !== -1) {
        const updatedUsuario = { ...usuarios[index], ...req.body };
        usuarios[index] = updatedUsuario;
        writeUsuariosToFile(usuarios);
        res.status(200).json(updatedUsuario);
    } else {
        res.status(404).json({ message: `Usuario con DNI ${dni} no encontrado` });
    }
});

router.delete('/:dni', (req, res) => {
    const { dni } = req.params;
    const usuarios = readUsuariosFromFile();
    const index = usuarios.findIndex(u => u.DNI === parseInt(dni));

    if (index !== -1) {
        usuarios.splice(index, 1);
        writeUsuariosToFile(usuarios);
        res.status(200).json({ message: `Usuario con DNI ${dni} eliminado` });
    } else {
        res.status(404).json({ message: `Usuario con DNI ${dni} no encontrado` });
    }
});

module.exports = router;

