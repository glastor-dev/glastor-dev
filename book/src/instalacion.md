# Guía de Instalación

**Glastor ReadmeGen** está diseñado para ejecutarse sobre el runtime de **Deno**. Requiere Deno versión `1.40.0` o superior.

---

## 1. Requisitos Previos

Si aún no tienes Deno instalado en tu sistema:

### En Windows (PowerShell)

```powershell
irm https://deno.land/install.ps1 | iex
```

### En macOS / Linux (Terminal)

```bash
curl -fsSL https://deno.land/install.sh | sh
```

Verifica la instalación:

```bash
deno --version
```

---

## 2. Instalación de ReadmeGen como CLI Global

Puedes compilar e instalar el comando `readmegen` directamente en tu PATH del sistema:

### Desde el repositorio local

Clona el repositorio y ejecuta:

```bash
deno install -A -n readmegen ./src/main.ts
```

Una vez instalado, el comando estará disponible en cualquier terminal:

```bash
readmegen --version
```

---

## 3. Uso mediante Tareas de Deno (`deno task`)

Si estás trabajando directamente en el repositorio de Glastor, no necesitas instalar el CLI de forma global. Puedes utilizar las tareas predefinidas en `deno.json`:

```bash
# Generar el README estándar
deno task readme

# Forzar la sobrescritura del README
deno task readme:force

# Generar un README de prueba sin alterar el principal
deno task readme:check
```

---

## 4. Ejecución en Contenedores Docker

El proyecto incluye un `Dockerfile` optimizado con Deno preinstalado:

```bash
# Construir la imagen
docker build -t glastor-readmegen .

# Ejecutar el generador montando el directorio actual
docker run --rm -v "$(pwd):/app" glastor-readmegen
```
