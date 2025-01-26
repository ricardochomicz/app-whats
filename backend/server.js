const express = require('express');
const cors = require('cors');
const db = require('./database/db');
const empresasRouter = require('./routes/empresas');
const mensagensRouter = require('./routes/mensagens');
const comentariosRouter = require('./routes/comentarios');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3003;

// Rotas serão adicionadas aqui
app.use('/api/empresas', empresasRouter);
app.use('/api/contatos', require('./routes/contatos'));
app.use('/api/mensagens', mensagensRouter);
app.use('/api/telefones', require('./routes/telefones'));
app.use('/api/comentarios', comentariosRouter);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
}); 