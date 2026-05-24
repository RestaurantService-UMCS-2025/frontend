# ETAP 1: Budowanie aplikacji
FROM node:20-alpine AS builder

WORKDIR /app

# Kopiujemy pliki z zależnościami i instalujemy je
COPY package*.json ./
RUN npm install

# Kopiujemy resztę kodu i budujemy wersję produkcyjną (katalog dist)
COPY . .
RUN npm run build

# ETAP 2: Lekki serwer produkcyjny
FROM node:20-alpine

WORKDIR /app

# Instalujemy globalnie lekki serwer 'serve'
RUN npm install -g serve

# Kopiujemy tylko zbudowane pliki z etapu pierwszego
COPY --from=builder /app/dist ./dist

# Informujemy, że kontener nasłuchuje na porcie 3000
EXPOSE 3000

# Uruchamiamy serwer.
# -s (single page application) sprawia, że routing Vue (np. /about) zadziała poprawnie
# -l 3000 wymusza działanie na porcie 3000
CMD ["serve", "-s", "dist", "-l", "3000"]