const db = require('../database/db');

class TelefoneService {
    async atualizarTelefone(numeroAntigo, novoNumero) {
        return new Promise((resolve, reject) => {
            // Primeiro busca o telefone para garantir que existe e pegar o contato_id
            db.get('SELECT id, contato_id FROM telefones WHERE numero = ?', [numeroAntigo], (err, telefone) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (!telefone) {
                    reject(new Error('Telefone não encontrado'));
                    return;
                }

                // Atualiza o número mantendo o mesmo contato_id
                db.run(
                    'UPDATE telefones SET numero = ?, status_envio = ? WHERE id = ?',
                    [novoNumero, 'pendente', telefone.id],
                    (err) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve({
                            message: 'Telefone atualizado com sucesso',
                            telefone: novoNumero
                        });
                    }
                );
            });
        });
    }

    async atualizarStatus(numero, status) {
        return new Promise((resolve, reject) => {
            db.run(
                'UPDATE telefones SET status_envio = ? WHERE numero = ?',
                [status, numero],
                (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve({ message: 'Status atualizado com sucesso' });
                }
            );
        });
    }
}

module.exports = new TelefoneService(); 