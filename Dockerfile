# Imagen oficial de Deno 2 en Alpine
FROM denoland/deno:alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia configuración y dependencias primero para optimizar la caché de capas
COPY deno.json deno.lock* ./

# Copia el código fuente
COPY src/ ./src/

# Cachea las dependencias del proyecto
RUN deno cache src/main.ts

# Seguridad: Usuario no privilegiado 'deno'
USER deno

# Comando por defecto con privilegios mínimos (PoLP)
CMD ["run", "--allow-read", "--allow-write", "--allow-env", "src/main.ts", "--help"]
