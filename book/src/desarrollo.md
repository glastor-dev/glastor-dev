# Contribución y Desarrollo

Esta guía detalla el entorno de desarrollo y los comandos necesarios para contribuir al proyecto **Glastor ReadmeGen**.

---

## 💻 Configuración Local

1. Clona el repositorio:
   ```bash
   git clone https://github.com/glastor-dev/glastor-dev.git
   cd glastor-dev
   ```

2. Verifica que tienes Deno instalado:
   ```bash
   deno --version
   ```

---

## 🧪 Pruebas Unitarias

El proyecto utiliza el test runner integrado de Deno (`deno test`). Las pruebas se encuentran ubicadas en el directorio `test/`:

```bash
# Ejecutar todas las pruebas
deno task test

# O directamente
deno test -A
```

---

## 🎨 Formateo y Linter

El repositorio cuenta con reglas estrictas de calidad de código configuradas en `deno.json`:

```bash
# Formatear el código automáticamente
deno task fmt

# Verificar formato sin modificar archivos (para CI)
deno task fmt:check

# Ejecutar el analizador estático de Deno
deno task lint

# Comprobación de tipos de TypeScript
deno task check
```

---

## ⚡ Benchmarks

Para medir el rendimiento del motor de plantillas y la sanitización de Markdown:

```bash
deno task bench
```

Los benchmarks garantizan que la generación de documentación se complete en milisegundos, incluso en repositorios con cientos de archivos fuente.

---

## 📖 Compilación de esta Documentación

La documentación está construida con **mdBook**. Para previsualizarla localmente:

```bash
cd book
mdbook serve --open
```

Cada cambio en la rama `master` desencadena automáticamente el flujo de GitHub Actions (`.github/workflows/mdbook.yml`), compilando y desplegando esta web en GitHub Pages.
