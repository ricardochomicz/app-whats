const express = require('express');
const router = express.Router();
const comentarioService = require('../services/comentarioService');

// Listar comentários por empresa
router.get('/empresa/:empresaId', async (req, res) => {
    try {
        const { empresaId } = req.params;
        const comentarios = await comentarioService.listarComentariosPorEmpresa(empresaId);
        res.json(comentarios);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Criar novo comentário
router.post('/', async (req, res) => {
    try {
        const comentario = await comentarioService.criarComentario(req.body);
        res.json(comentario);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router; 