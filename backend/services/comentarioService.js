const db = require('../database/db');

class ComentarioService {
    async listarComentariosPorEmpresa(empresaId) {
        return new Promise((resolve, reject) => {
            db.all(
                `SELECT * FROM comentarios 
                 WHERE empresa_id = ? 
                 ORDER BY data_envio DESC`,
                [empresaId],
                (err, rows) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(rows);
                }
            );
        });
    }

    async criarComentario(comentarioData) {
        const { empresa_id, comentario } = comentarioData;
        return new Promise((resolve, reject) => {
            db.run(
                'INSERT INTO comentarios (empresa_id, comentario) VALUES (?, ?)',
                [empresa_id, comentario],
                function (err) {
                    if (err) {
                        reject(err);
                        return;
                    }

                    // Busca o comentário recém criado para retornar
                    db.get(
                        'SELECT * FROM comentarios WHERE id = ?',
                        [this.lastID],
                        (err, row) => {
                            if (err) {
                                reject(err);
                                return;
                            }
                            resolve(row);
                        }
                    );
                }
            );
        });
    }
}

module.exports = new ComentarioService(); 