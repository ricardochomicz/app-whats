const db = require('../database/db');

class ContatoService {
    async listarContatos() {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM contatos', [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        });
    }

    async criarContato(contatoData) {
        const { empresa_id, nome, telefone } = contatoData;
        return new Promise((resolve, reject) => {
            db.run(
                'INSERT INTO contatos (empresa_id, nome, telefone) VALUES (?, ?, ?)',
                [empresa_id, nome, telefone],
                function (err) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve({ id: this.lastID });
                }
            );
        });
    }
}

module.exports = new ContatoService(); 