const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, 'database.sqlite');

// Verifica se o diretório existe, se não, cria
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados SQLite');

    // Criar tabelas
    db.serialize(() => {
        // Tabela empresas
        db.run(`
            CREATE TABLE IF NOT EXISTS empresas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                cnpj TEXT UNIQUE,
                operadora TEXT,
                cep TEXT,
                endereco TEXT,
                cidade TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Tabela contatos
        db.run(`
            CREATE TABLE IF NOT EXISTS contatos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                empresa_id INTEGER,
                nome TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (empresa_id) REFERENCES empresas (id) ON DELETE CASCADE
            )
        `);

        // Tabela telefones
        db.run(`
            CREATE TABLE IF NOT EXISTS telefones (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                contato_id INTEGER NULL,
                empresa_id INTEGER NULL,
                numero TEXT NOT NULL,
                ultimo_envio DATETIME,
                status_envio TEXT DEFAULT 'pendente',
                FOREIGN KEY (contato_id) REFERENCES contatos (id) ON DELETE CASCADE,
                FOREIGN KEY (empresa_id) REFERENCES empresas (id) ON DELETE CASCADE
            )
        `);

        // Tabela mensagens
        db.run(`
            CREATE TABLE IF NOT EXISTS mensagens (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                titulo TEXT NOT NULL,
                conteudo TEXT NOT NULL,
                telefone_numero TEXT,
                data_envio DATETIME DEFAULT CURRENT_TIMESTAMP,
                status TEXT DEFAULT 'pendente'
            )
        `);

        // Tabela de histórico de envios
        db.run(`
            CREATE TABLE IF NOT EXISTS envios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                telefone_numero TEXT,
                mensagem_id INTEGER,
                data_envio DATETIME DEFAULT CURRENT_TIMESTAMP,
                status TEXT DEFAULT 'enviado',
                FOREIGN KEY (mensagem_id) REFERENCES mensagens (id)
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS comentarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                empresa_id INTEGER,
                comentario TEXT,
                data_envio DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
    });
});

module.exports = db; 