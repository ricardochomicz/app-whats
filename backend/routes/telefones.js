const express = require('express');
const router = express.Router();
const telefoneService = require('../services/telefoneService');

router.put('/:numero', async (req, res) => {
    try {
        const resultado = await telefoneService.atualizarTelefone(req.params.numero, req.body.numero);
        res.json(resultado);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:numero/status', async (req, res) => {
    try {
        const resultado = await telefoneService.atualizarStatus(req.params.numero, req.body.status);
        res.json(resultado);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router; 