# Configuración (`.readmegen.json`)

**Glastor ReadmeGen** permite una personalización exhaustiva a través del archivo de configuración opcional `.readmegen.json` en la raíz del proyecto.

---

## 📄 Estructura del Archivo

A continuación se muestra un ejemplo con todas las opciones disponibles:

```json
{
  "projectName": "Mi Proyecto",
  "description": "Librería de alto rendimiento para procesamiento de datos en Deno.",
  "repo": "glastor-dev/readmegen",
  "defaultBranch": "master",
  "ciWorkflow": "ci.yml",
  "badgeStyle": "for-the-badge",
  "license": "GPL-3.0-only",
  "includeExamples": true,
  "strict": false,
  "exclude": [
    ".git",
    "node_modules",
    "dist",
    "build",
    "test"
  ],
  "sections": {
    "installation": true,
    "api": true,
    "contributing": true,
    "license": true,
    "dependencies": true
  },
  "api": {
    "include": ["src/mod.ts"],
    "exclude": ["src/utils/internal.ts"],
    "hideInternal": true
  },
  "sanitize": {
    "forceBannerFirst": true,
    "bannerLine": "![Banner](images/banner.webp)"
  }
}
```

---

## ⚙️ Descripción de Campos

### Opciones Generales

| Campo           | Tipo     | Descripción                                                                                             |
| --------------- | -------- | ------------------------------------------------------------------------------------------------------- |
| `projectName`   | `string` | Nombre que encabezará el README. Si no se especifica, se utiliza el nombre de la carpeta o `deno.json`. |
| `description`   | `string` | Descripción principal. Si se omite, se infiere del archivo README existente o de `deno.json`.           |
| `repo`          | `string` | Repositorio en GitHub con formato `usuario/repositorio`. Necesario para generar badges de CI y enlaces. |
| `defaultBranch` | `string` | Rama principal del repositorio (por defecto: `main` o `master`).                                        |
| `ciWorkflow`    | `string` | Nombre del archivo de workflow para el badge de compilación (ej. `ci.yml`).                             |
| `badgeStyle`    | `string` | Estilo visual de shields.io (`flat`, `flat-square`, `for-the-badge`, `plastic`).                        |
| `license`       | `string` | Identificador SPDX de la licencia del proyecto (ej. `MIT`, `GPL-3.0-only`).                             |

---

### Control de Secciones (`sections`)

Permite habilitar o deshabilitar bloques enteros de contenido generado:

- `installation`: Bloque con instrucciones de instalación.
- `api`: Tabla de referencia con funciones y tipos exportados.
- `contributing`: Pautas de contribución y requisitos de Pull Request.
- `license`: Información de licencia.
- `dependencies`: Listado de paquetes JSR, Deno y NPM importados.

---

### Filtros de API (`api`)

Permite afinar la extracción del parser AST:

- `include`: Lista de archivos específicos a analizar para extraer símbolos.
- `exclude`: Archivos de código a omitir.
- `hideInternal`: Si es `true`, oculta funciones o tipos marcados con la etiqueta `@internal` de JSDoc.
