FROM node:18-alpine

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Servir arquivos estáticos
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"]
