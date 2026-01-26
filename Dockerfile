# Utiliza la imagen oficial de Deno
FROM denoland/deno:alpine-1.40.4

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos del proyecto
COPY . .

# Expone el puerto si tu app lo necesita (opcional)
# EXPOSE 8000

# Comando por defecto: muestra ayuda del CLI
CMD ["run", "--allow-read", "--allow-write", "--allow-env", "--allow-net", "src/main.ts", "--help"]
