# Usa un'immagine di Node.js come base
FROM node:18

# Imposta la directory di lavoro all'interno del contenitore
WORKDIR /

# Copia il package.json e package-lock.json nella directory di lavoro
COPY package*.json ./

# Installa le dipendenze del progetto
RUN npm install

# Copia tutto il contenuto del progetto nella directory di lavoro
COPY . .

# Compila il progetto
RUN npm run build

# Espone la porta 3000 su cui il server Vite ascolterà
EXPOSE 5000

# Comando da eseguire all'avvio del contenitore
CMD ["npm", "run", "serve"]
