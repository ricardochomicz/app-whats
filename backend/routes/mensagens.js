const express = require('express');
const router = express.Router();
const mensagemService = require('../services/mensagemService');

// Listar todas as mensagens
router.get('/', async (req, res) => {
    try {
        const mensagens = await mensagemService.listarMensagens();
        res.json(mensagens);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Criar nova mensagem
router.post('/', async (req, res) => {
    try {
        const resultado = await mensagemService.criarMensagem(req.body);
        res.json(resultado);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const mensagem = await mensagemService.buscarMensagemPorId(req.params.id);
        res.json(mensagem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const resultado = await mensagemService.atualizarMensagem(req.params.id, req.body);
        res.json(resultado);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Enviar mensagem
router.post('/enviar', async (req, res) => {
    try {
        const resultado = await mensagemService.enviarMensagem(req.body);
        res.json(resultado);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router; 