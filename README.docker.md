# Instrucciones para usar Docker con este proyecto

## Construir la imagen

```sh
docker build -t glastor-deno .
```

## Ejecutar el CLI (por ejemplo, para generar el README)

### Windows (PowerShell)

```powershell
docker run --rm -v ${PWD}:/app glastor-deno run --allow-read --allow-write --allow-env --allow-net src/main.ts
```

### Windows (CMD)

```sh
docker run --rm -v %cd%:/app glastor-deno run --allow-read --allow-write --allow-env --allow-net src/main.ts
```

- El volumen `-v %cd%:/app` permite que los cambios en tu carpeta local se reflejen dentro del contenedor.
- Puedes añadir argumentos al final para usar las opciones del CLI.

## Ejemplo: generar README con plantilla minimal

```sh
docker run --rm -v %cd%:/app glastor-deno run --allow-read --allow-write --allow-env --allow-net src/main.ts -t minimal
```

---

## Regenerar README.md desde README.profile.md

Para actualizar el `README.md` usando tu plantilla base `README.profile.md`, simplemente ejecuta:

```sh
docker run --rm -v %cd%:/app glastor-deno run --allow-read --allow-write --allow-env --allow-net src/main.ts
```

Esto tomará el contenido de `README.profile.md` y generará el nuevo `README.md` automáticamente.

Si usas Linux/Mac, reemplaza `%cd%` por `$(pwd)`.
