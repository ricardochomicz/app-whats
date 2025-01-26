const db = require('../database/db');

class MensagemService {
    async listarMensagens() {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM mensagens', [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        });
    }

    async criarMensagem(mensagemData) {
        const { titulo, conteudo } = mensagemData;
        return new Promise((resolve, reject) => {
            db.run(
                'INSERT INTO mensagens (titulo, conteudo) VALUES (?, ?)',
                [titulo, conteudo],
                function (err, row) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(row);
                }
            );
        });
    }

    async buscarMensagemPorId(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM mensagens WHERE id = ?', [id], (err, row) => {
                resolve(row);
            });
        });
    }

    async atualizarMensagem(id, mensagemData) {
        const { titulo, conteudo } = mensagemData;
        return new Promise((resolve, reject) => {
            db.run('UPDATE mensagens SET titulo = ?, conteudo = ? WHERE id = ?', [titulo, conteudo, id], (err) => {
                resolve(err);
            });
        });
    }

    async enviarMensagem(dados) {
        const { telefone, mensagemId } = dados;

        return new Promise((resolve, reject) => {
            db.serialize(() => {
                // Busca a mensagem
                db.get('SELECT * FROM mensagens WHERE id = ?', [mensagemId], (err, mensagem) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    const dataEnvio = new Date().toISOString();

                    // Atualiza o status do telefone
                    db.run(
                        'UPDATE telefones SET ultimo_envio = ?, status_envio = ? WHERE numero = ?',
                        [dataEnvio, 'enviado', telefone],
                        (err) => {
                            if (err) {
                                reject(err);
                                return;
                            }

                            // Registra o envio
                            db.run(
                                'INSERT INTO envios (telefone_numero, mensagem_id, data_envio, status) VALUES (?, ?, ?, ?)',
                                [telefone, mensagemId, dataEnvio, 'enviado'],
                                (err) => {
                                    if (err) {
                                        reject(err);
                                        return;
                                    }
                                    resolve({
                                        message: 'Mensagem enviada com sucesso',
                                        dataEnvio: dataEnvio,
                                        titulo: mensagem.titulo
                                    });
                                }
                            );
                        }
                    );
                });
            });
        });
    }
}

module.exports = new MensagemService(); 