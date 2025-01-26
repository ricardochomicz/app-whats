const express = require('express');
const router = express.Router();
const empresaService = require('../services/empresaService');

// Listar todas as empresas
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const filtros = {
            busca: req.query.busca,
            mensagem: req.query.mensagem,
            dataInicio: req.query.dataInicio,
            dataFim: req.query.dataFim
        };
        const empresas = await empresaService.listarEmpresas(page, limit, filtros);
        res.json(empresas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Criar nova empresa
router.post('/', async (req, res) => {
    try {
        const resultado = await empresaService.criarEmpresa(req.body);
        res.json(resultado);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Verificar se CNPJ já existe
router.get('/:cnpj/cnpj', async (req, res) => {
    try {
        const { cnpj } = req.params;
        const resultado = await empresaService.verificarCnpj(cnpj);
        res.json(resultado);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const empresa = await empresaService.buscarEmpresaPorId(req.params.id);
        res.json(empresa);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Consultar CNPJ na Receita
router.get('/:cnpj/consulta', async (req, res) => {
    try {
        const { cnpj } = req.params;
        const dadosReceita = await empresaService.consultarCnpjReceita(cnpj);
        res.json({ data: dadosReceita });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Atualizar empresa
router.put('/:id', async (req, res) => {
    try {
        const resultado = await empresaService.atualizarEmpresa(req.params.id, req.body);
        res.json(resultado);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Rota para excluir empresa
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await empresaService.excluirEmpresa(id);
        res.json(resultado);
    } catch (erro) {
        console.error('Erro ao excluir empresa:', erro);
        res.status(500).json({
            erro: 'Erro ao excluir empresa',
            detalhes: erro.message
        });
    }
});

module.exports = router; 