# Introducción a Glastor ReadmeGen

**Glastor ReadmeGen** (`@glastor-dev/readmegen`) es una herramienta de ingeniería de software desarrollada en **Deno** y **TypeScript** diseñada para automatizar el análisis estático de repositorios y la generación de archivos `README.md` profesionales y listos para producción.

---

## 🎯 El Problema

Mantener la documentación y los archivos `README.md` actualizados en proyectos de código abierto o comerciales suele ser una tarea manual propensa a errores y desactualizaciones:

- Badges de CI/CD rotos o apuntando a ramas erróneas.
- Dependencias obsoletas que no coinciden con `deno.json` o `import_map.json`.
- Ejemplos de código desfasados respecto a la API real.
- Tablas de contenido (TOC) desincronizadas con los encabezados.

## 💡 La Solución: Glastor ReadmeGen

**ReadmeGen** resuelve este problema mediante introspección estática automatizada:

1. **Inspección de configuración**: Analiza `deno.json`, `deno.lock` e `import_map.json` para extraer versiones, scripts y dependencias.
2. **Análisis de código fuente (AST)**: Utiliza parsers de TypeScript para extraer interfaces, funciones públicas, tipos y documentación JSDoc.
3. **Detección de CI/CD y Calidad**: Examina workflows de GitHub Actions (`.github/workflows/`), linters y tests configurados.
4. **Motor de renderizado flexible**: Inyecta la información en plantillas modulares (`minimal`, `modern`, `detailed`) o preserva plantillas de perfil personalizadas (`README.profile.md`).

---

## 🚀 Principales Características

| Característica                | Descripción                                                                            |
| ----------------------------- | -------------------------------------------------------------------------------------- |
| **Detección Automática**      | Extrae metadatos directamente del código sin configuración obligatoria.                |
| **Parser AST de TypeScript**  | Genera tablas de API con firmas de métodos, parámetros y tipos de retorno.             |
| **Badges Dinámicos**          | Insignias de versión de Deno, estado de GitHub Actions, licencias y sponsors.          |
| **Generador de TOC**          | Crea tablas de contenido navegables de forma automática.                               |
| **Asistente CLI Interactivo** | Comando `init` guiado para crear archivos de configuración `.readmegen.json`.          |
| **Soporte de GitHub Actions** | Diseñado para ejecutarse en pipelines de CI/CD para mantener el README siempre al día. |

---

## 📚 Estructura de esta Documentación

En las siguientes secciones encontrarás el detalle completo de cómo se construyó la herramienta y cómo utilizarla:

- **[Cómo se realizó](./como-se-realizo.md)**: Visión general del proceso de desarrollo y diseño.
- **[Arquitectura del Sistema](./arquitectura.md)**: Diagramas y desglose de capas y módulos.
- **[Análisis de Proyectos y AST](./analisis-ast.md)**: Cómo funciona la extracción de datos y el parseo de código.
- **[Motor de Plantillas](./plantillas-generacion.md)**: El sistema de inyección y limpieza de Markdown.
- **[Guía de Instalación](./instalacion.md)**: Requisitos y pasos para instalar el CLI.
- **[Uso del CLI](./guia.md)**: Comandos, argumentos y modos de uso.
- **[Configuración](./configuracion.md)**: Opciones avanzadas de `.readmegen.json`.
- **[Referencia de la API](./api.md)**: Uso programático mediante `generateReadme` y `analyzeProject`.
