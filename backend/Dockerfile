FROM node:20-alpine

WORKDIR /app

# Copia os arquivos de configuração
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o código fonte
COPY . .

EXPOSE 3003

CMD ["node", "server.js"] 