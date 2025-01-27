const db = require('../database/db');
const axios = require('axios');

class EmpresaService {
    constructor() {
        this.cacheConsultas = new Map();
    }

    async listarEmpresas(page = 1, limit = 10, filtros = {}) {
        return new Promise((resolve, reject) => {
            const offset = (page - 1) * limit;
            const params = [];
            let whereClause = 'WHERE NOT EXISTS (SELECT 1 FROM telefones t WHERE (t.contato_id = c.id OR t.empresa_id = e.id) AND t.status_envio = "oportunidade")';

            // Constrói a cláusula WHERE baseada nos filtros
            const conditions = [];
            if (filtros.busca) {
                conditions.push('(e.nome LIKE ? OR e.cnpj LIKE ?)');
                params.push(`%${filtros.busca}%`, `%${filtros.busca}%`);
            }
            if (filtros.mensagem) {
                conditions.push('m.titulo LIKE ?');
                params.push(`%${filtros.mensagem}%`);
            }
            if (filtros.dataInicio) {
                conditions.push('env.data_envio >= ?');
                params.push(filtros.dataInicio);
            }
            if (filtros.dataFim) {
                conditions.push('env.data_envio <= ?');
                params.push(filtros.dataFim);
            }

            if (conditions.length > 0) {
                whereClause += ' AND ' + conditions.join(' AND ');
            }

            // Query para contar total de registros
            const countQuery = `
                SELECT COUNT(DISTINCT e.id) as total 
                FROM empresas e
                LEFT JOIN contatos c ON c.empresa_id = e.id
                LEFT JOIN telefones t ON t.contato_id = c.id OR t.empresa_id = e.id
                LEFT JOIN envios env ON env.telefone_numero = t.numero
                LEFT JOIN mensagens m ON m.id = env.mensagem_id
                ${whereClause}
            `;

            db.get(countQuery, params, (err, count) => {
                if (err) {
                    reject(err);
                    return;
                }

                // Adiciona parâmetros de paginação
                params.push(limit, offset);

                // Query principal com filtros
                const query = `
                    SELECT 
                        e.*,
                        c.nome as contato_nome,
                        t.numero as primeiro_telefone,
                        env.data_envio as ultimo_envio,
                        m.titulo as ultima_mensagem
                    FROM empresas e
                    LEFT JOIN contatos c ON c.empresa_id = e.id
                    LEFT JOIN telefones t ON t.contato_id = c.id OR t.empresa_id = e.id
                    LEFT JOIN (
                        SELECT 
                            telefone_numero,
                            MAX(data_envio) as max_data_envio
                        FROM envios
                        GROUP BY telefone_numero
                    ) ultimo_env ON ultimo_env.telefone_numero = t.numero
                    LEFT JOIN envios env ON env.telefone_numero = t.numero 
                        AND env.data_envio = ultimo_env.max_data_envio
                    LEFT JOIN mensagens m ON m.id = env.mensagem_id
                    ${whereClause}
                    GROUP BY e.id
                    ORDER BY e.nome
                    LIMIT ? OFFSET ?
                `;

                db.all(query, params, (err, rows) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve({
                        data: rows,
                        total: count.total,
                        currentPage: page,
                        totalPages: Math.ceil(count.total / limit)
                    });
                });
            });
        });
    }

    async criarEmpresa(empresaData) {
        const { nome, cnpj, operadora, cep, endereco, cidade, contato, telefones } = empresaData;

        return new Promise((resolve, reject) => {
            db.serialize(() => {
                db.run('BEGIN TRANSACTION');

                // Insere a empresa
                db.run(
                    'INSERT INTO empresas (nome, cnpj, operadora, cep, endereco, cidade) VALUES (?, ?, ?, ?, ?, ?)',
                    [nome, cnpj, operadora, cep, endereco, cidade],
                    function (err) {
                        if (err) {
                            db.run('ROLLBACK');
                            reject(err);
                            return;
                        }

                        const empresa_id = this.lastID;

                        // Se tiver telefones, mas não tiver contato
                        if (telefones && telefones.length > 0 && !contato) {
                            let completed = 0;
                            let hasError = false;

                            // Insere os telefones associados diretamente à empresa
                            telefones.forEach(telefone => {
                                db.run(
                                    'INSERT INTO telefones (empresa_id, numero) VALUES (?, ?)',
                                    [empresa_id, telefone],
                                    (err) => {
                                        if (err && !hasError) {
                                            hasError = true;
                                            db.run('ROLLBACK');
                                            reject(err);
                                            return;
                                        }

                                        completed++;
                                        if (completed === telefones.length && !hasError) {
                                            db.run('COMMIT');
                                            resolve({
                                                message: 'Empresa e telefones cadastrados com sucesso',
                                                empresa_id: empresa_id
                                            });
                                        }
                                    }
                                );
                            });
                        }
                        // Se tiver contato, continua com o fluxo original
                        else if (contato) {
                            db.run(
                                'INSERT INTO contatos (empresa_id, nome) VALUES (?, ?)',
                                [empresa_id, contato],
                                function (err) {
                                    if (err) {
                                        db.run('ROLLBACK');
                                        reject(err);
                                        return;
                                    }

                                    const contato_id = this.lastID;

                                    if (telefones && telefones.length > 0) {
                                        let completed = 0;
                                        let hasError = false;

                                        telefones.forEach(telefone => {
                                            db.run(
                                                'INSERT INTO telefones (contato_id, numero) VALUES (?, ?)',
                                                [contato_id, telefone],
                                                (err) => {
                                                    if (err && !hasError) {
                                                        hasError = true;
                                                        db.run('ROLLBACK');
                                                        reject(err);
                                                        return;
                                                    }

                                                    completed++;
                                                    if (completed === telefones.length && !hasError) {
                                                        db.run('COMMIT');
                                                        resolve({
                                                            message: 'Empresa, contato e telefones cadastrados com sucesso',
                                                            empresa_id: empresa_id
                                                        });
                                                    }
                                                }
                                            );
                                        });
                                    } else {
                                        db.run('COMMIT');
                                        resolve({
                                            message: 'Empresa e contato cadastrados com sucesso',
                                            empresa_id: empresa_id
                                        });
                                    }
                                }
                            );
                        } else {
                            db.run('COMMIT');
                            resolve({
                                message: 'Empresa cadastrada com sucesso',
                                empresa_id: empresa_id
                            });
                        }
                    }
                );
            });
        });
    }

    async verificarCnpj(cnpj) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM empresas WHERE cnpj = ?', [cnpj], (err, empresa) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve({
                    exists: empresa ? true : false,
                    empresa: empresa || null
                });
            });
        });
    }

    async consultarCnpjReceita(cnpj) {
        try {
            console.log('Iniciando consulta do CNPJ:', cnpj);

            if (this.cacheConsultas.has(cnpj)) {
                console.log('CNPJ encontrado no cache');
                return this.cacheConsultas.get(cnpj);
            }

            console.log('Consultando API da Receita...');
            await new Promise(resolve => setTimeout(resolve, 1000));

            const response = await axios.get(`https://receitaws.com.br/v1/cnpj/${cnpj}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            console.log('Resposta recebida da API');
            this.cacheConsultas.set(cnpj, response.data);

            return response.data;
        } catch (error) {
            console.error('Erro detalhado na consulta do CNPJ:', error);
            throw new Error('Erro ao consultar CNPJ na Receita');
        }
    }

    async buscarEmpresaPorId(id) {
        return new Promise((resolve, reject) => {
            const empresa = {};

            // Busca a empresa com contato e todos os telefones (vinculados ao contato ou à empresa)
            const query = `
                SELECT 
                    e.*,
                    c.nome as contato_nome,
                    c.id as contato_id,
                    t.numero,
                    t.id as telefone_id,
                    t.status_envio,
                    t.ultimo_envio,
                    (
                        SELECT m.titulo 
                        FROM mensagens m 
                        JOIN envios env ON env.mensagem_id = m.id 
                        WHERE env.telefone_numero = t.numero 
                        ORDER BY env.data_envio DESC 
                        LIMIT 1
                    ) as ultima_mensagem
                FROM empresas e
                LEFT JOIN contatos c ON c.empresa_id = e.id
                LEFT JOIN telefones t ON (t.contato_id = c.id OR t.empresa_id = e.id)
                WHERE e.id = ?
            `;

            db.all(query, [id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (!rows || rows.length === 0) {
                    reject(new Error('Empresa não encontrada'));
                    return;
                }

                // Copia os dados da empresa
                empresa.id = rows[0].id;
                empresa.nome = rows[0].nome;
                empresa.cnpj = rows[0].cnpj;
                empresa.operadora = rows[0].operadora;
                empresa.cep = rows[0].cep;
                empresa.endereco = rows[0].endereco;
                empresa.cidade = rows[0].cidade;
                empresa.contato = rows[0].contato_nome || '';

                // Processa telefones
                empresa.telefones = [];
                empresa.ultimosEnvios = {};
                empresa.status_telefones = {};

                rows.forEach(row => {
                    if (row.numero) {
                        if (!empresa.telefones.includes(row.numero)) {
                            empresa.telefones.push(row.numero);
                        }
                        empresa.ultimosEnvios[row.numero] = {
                            data: row.ultimo_envio,
                            status: row.status_envio,
                            mensagem: row.ultima_mensagem
                        };
                        empresa.status_telefones[row.numero] = row.status_envio || 'pendente';
                    }
                });

                resolve(empresa);
            });
        });
    }

    async atualizarEmpresa(id, empresaData) {
        const { nome, operadora, cep, endereco, cidade, contato, telefones } = empresaData;

        return new Promise((resolve, reject) => {
            db.serialize(() => {
                db.run('BEGIN TRANSACTION');

                // Atualiza a empresa
                db.run(
                    'UPDATE empresas SET nome = ?, operadora = ?, cep = ?, endereco = ?, cidade = ? WHERE id = ?',
                    [nome, operadora, cep, endereco, cidade, id],
                    async (err) => {
                        if (err) {
                            db.run('ROLLBACK');
                            reject(err);
                            return;
                        }

                        try {
                            // Remove todos os telefones existentes da empresa
                            await new Promise((resolve, reject) => {
                                db.run('DELETE FROM telefones WHERE empresa_id = ? OR contato_id IN (SELECT id FROM contatos WHERE empresa_id = ?)',
                                    [id, id],
                                    err => err ? reject(err) : resolve(true));
                            });

                            // Se tem telefones mas não tem contato
                            if (telefones && telefones.length > 0 && !contato) {
                                // Remove contatos antigos se existirem
                                await new Promise((resolve, reject) => {
                                    db.run('DELETE FROM contatos WHERE empresa_id = ?',
                                        [id],
                                        err => err ? reject(err) : resolve(true));
                                });

                                // Insere os novos telefones vinculados à empresa
                                for (const telefone of telefones) {
                                    await new Promise((resolve, reject) => {
                                        db.run('INSERT INTO telefones (empresa_id, numero) VALUES (?, ?)',
                                            [id, telefone],
                                            err => err ? reject(err) : resolve(true));
                                    });
                                }
                            }
                            // Se tem contato
                            else if (contato) {
                                // Busca ou cria o contato
                                const contatoId = await new Promise((resolve, reject) => {
                                    db.run('INSERT OR REPLACE INTO contatos (empresa_id, nome) VALUES (?, ?)',
                                        [id, contato],
                                        function (err) {
                                            if (err) reject(err);
                                            else resolve(this.lastID);
                                        });
                                });

                                // Insere os novos telefones vinculados ao contato
                                if (telefones && telefones.length > 0) {
                                    for (const telefone of telefones) {
                                        await new Promise((resolve, reject) => {
                                            db.run('INSERT INTO telefones (contato_id, numero) VALUES (?, ?)',
                                                [contatoId, telefone],
                                                err => err ? reject(err) : resolve(true));
                                        });
                                    }
                                }
                            }

                            db.run('COMMIT');
                            resolve({ message: 'Empresa atualizada com sucesso' });
                        } catch (error) {
                            db.run('ROLLBACK');
                            reject(error);
                        }
                    }
                );
            });
        });
    }

    async excluirEmpresa(id) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM empresas WHERE id = ?', [id], function (err) {
                if (err) {
                    console.error('Erro ao excluir empresa:', err);
                    reject(err);
                    return;
                }

                if (this.changes === 0) {
                    reject(new Error('Empresa não encontrada'));
                    return;
                }

                resolve({ message: 'Empresa excluída com sucesso' });
            });
        });
    }
}

module.exports = new EmpresaService(); 