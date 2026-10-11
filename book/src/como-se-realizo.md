# Cómo se Realizó Glastor ReadmeGen

Esta sección documenta el proceso de ingeniería, decisiones técnicas y evolución detrás del desarrollo de **Glastor ReadmeGen**.

---

## 🏛️ Evolución del Proyecto

1. **Fase Inicial (Rust)**:
   - El proyecto comenzó originalmente como una herramienta CLI compilada en **Rust** (`crate glastor_dev`) con utilidades de generación y análisis de estadísticas en GitHub.
   - Aunque Rust ofrecía un rendimiento extremo y binarios independientes, la integración directa con proyectos del ecosistema Deno requería soporte nativo para TypeScript sin pasos de compilación intermedios.

2. **Migración a Deno & TypeScript (v2.0+)**:
   - Para alinearse con las mejores prácticas modernas de JavaScript/TypeScript, el proyecto fue rediseñado desde cero sobre el **Runtime de Deno**.
   - **Beneficios obtenidos**:
     - Ejecución nativa de TypeScript sin tooling complejo (Babel, Webpack).
     - Permisos granulares de seguridad (`--allow-read`, `--allow-write`).
     - Ecosistema estándar de pruebas (`deno test`), linters (`deno lint`) y formateo (`deno fmt`).
     - Facilidad para ejecutarse directamente en pipelines de GitHub Actions mediante `deno run`.

---

## 🛠️ Tecnologías y Librerías Utilizadas

El desarrollo de la herramienta se apoya en tecnologías seleccionadas por su robustez y rendimiento:

- **Runtime**: [Deno](https://deno.land/) (versión 1.40.0 o superior).
- **CLI Framework**: [`@cliffy/command`](https://jsr.io/@cliffy/command) para la construcción de una interfaz de línea de comandos tipada, con validación de opciones y subcomandos.
- **Prompts Interactivos**: [`@cliffy/prompt`](https://jsr.io/@cliffy/prompt) para el asistente interactivo `readmegen init`.
- **Manipulación de Rutas y Archivos**: Módulos oficiales de Deno Standard Library (`@std/path`, `@std/fs`).
- **Análisis de Código (AST)**: Parsers integrados con expresiones regulares y análisis de tokens para extraer firmas JSDoc, funciones exportadas e interfaces sin requerir compiladores externos pesados.
- **Documentación Estática**: [mdBook](https://rust-lang.github.io/mdBook/) desplegado automáticamente mediante GitHub Actions en GitHub Pages.

---

## ⚙️ Flujo de Ejecución del Generador

El proceso de generación sigue una tubería (pipeline) lineal y determinista:

```text
[Proyecto Deno]
       │
       ▼
 1. Carga de Configuración (.readmegen.json / CLI flags)
       │
       ▼
 2. Inspección Estática (Parsers)
    ├── deno.json (versión, scripts, metadatos)
    ├── import_map.json (mapeo de dependencias)
    ├── .github/workflows/ (workflows de CI/CD activos)
    └── src/ (análisis AST de símbolos y exportaciones)
       │
       ▼
 3. Enriquecimiento de Datos (Generators)
    ├── Generación de Badges (licencia, versión, build status)
    ├── Generación de Tabla de Contenidos (TOC)
    └── Generación de Documentación de API
       │
       ▼
 4. Renderizado de Plantilla (Template Engine)
    ├── Sustitución de variables {{key}}
    └── Inyección inteligente para evitar duplicaciones
       │
       ▼
 5. Sanitización y Normalización
    ├── Eliminación de líneas residuales
    └── Limpieza de BOM y caracteres invisibles
       │
       ▼
[README.md Generado]
```
