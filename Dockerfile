# Estágio de build
FROM node:20-alpine as build

WORKDIR /app

# Copia os arquivos de configuração
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia todo o código fonte
COPY . .

# Gera o build da aplicação
RUN npm run build

# Estágio de produção
FROM nginx:alpine

# Copia o build do estágio anterior
COPY --from=build /app/dist/app-whats/browser /usr/share/nginx/html

# Copia a configuração do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 