export interface Empresa {
    id: number;
    nome: string;
    cnpj: string;
    operadora: string;
    cep: string;
    endereco: string;
    cidade: string;
    created_at?: string;
    contato_nome?: string;
    primeiro_telefone?: string;
    ultimo_envio?: string;
    ultima_mensagem?: string;
}

export interface Contato {
    id: number;
    empresa_id: number;
    nome: string;
    created_at?: string;
}

export interface Mensagem {
    id: number;
    titulo: string;
    conteudo: string;
}

export interface Envio {
    id: number;
    telefone_numero: string;
    mensagem_id: number;
    data_envio: string;
    status: string;
}

export interface Telefone {
    id: number;
    contato_id: number;
    numero: string;
    ultimo_envio?: string;
    status_envio?: string;
}

