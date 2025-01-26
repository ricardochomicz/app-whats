const express = require('express');
const router = express.Router();
const contatoService = require('../services/contatoService');

// Listar todos os contatos
router.get('/', async (req, res) => {
    try {
        const contatos = await contatoService.listarContatos();
        res.json(contatos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Criar novo contato
router.post('/', async (req, res) => {
    try {
        const resultado = await contatoService.criarContato(req.body);
        res.json(resultado);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router; 