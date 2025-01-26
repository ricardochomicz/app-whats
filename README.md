##Projeto AppWhats

###Clone o repositório
```bash
git clone https://github.com/ricardochomicz/app-whats.git
cd app-whats
```

###Instale as dependências do frontend
```bash
npm install
```

###Instale as dependências do backend
```bash
cd backend
npm install
```
##Executando o projeto

###Inicie o servidor do backend
```bash
cd backend
node server.js
```

###Inicie o servidor do frontend
```bash
ng serve
```

###Acesse a aplicação no navegador
```bash
http://localhost:4200
```

## Estrutura do Banco de Dados 

### Tabelas
- empresas: Dados das empresas
- contatos: Contatos vinculados às empresas
- telefones: Números de telefone com status
- mensagens: Templates de mensagens
- envios: Histórico de envios
- comentarios: Comentários por empresa

## Endpoints da API

### Empresas
- GET /api/empresas - Lista empresas
- POST /api/empresas - Cria empresa
- GET /api/empresas/:id - Busca empresa
- PUT /api/empresas/:id - Atualiza empresa

### Mensagens
- GET /api/mensagens - Lista mensagens
- POST /api/mensagens - Cria mensagem
- POST /api/mensagens/enviar - Registra envio

### Comentários
- GET /api/comentarios/empresa/:id - Lista comentários
- POST /api/comentarios - Cria comentário

## Desenvolvimento

### Estrutura do Projeto
app-whats/
├── backend/
│ ├── database/
│ ├── routes/
│ ├── services/
│ └── server.js
└── src/
├── app/
│ ├── components/
│ ├── pages/
│ └── services/
└── environments/

## Autor
Ricardo Chomicz

## Licença
Este projeto está sob a licença MIT.





