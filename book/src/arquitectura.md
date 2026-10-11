# Arquitectura del Sistema

La base de código de **Glastor ReadmeGen** está organizada modularmente bajo el directorio `src/`, separando claramente la capa de interfaz (CLI), análisis de proyecto, generadores de contenido y utilidades de bajo nivel.

---

## 📂 Organización del Proyecto

```text
src/
├── main.ts               # Punto de entrada de la CLI (Cliffy)
├── mod.ts                # API programática principal (generateReadme)
│
├── project/              # Orquestador del análisis de proyecto
│   └── analyze.ts        # Recopila y coordina todos los parsers y generadores
│
├── parsers/              # Módulos de introspección estática
│   ├── deno_json.ts      # Lee y valida deno.json / deno.jsonc
│   ├── import_map.ts     # Lee import_map.json
│   ├── imports.ts        # Analiza importaciones externas y locales
│   ├── project_files.ts  # Detecta archivos clave (LICENSE, Dockerfile, etc.)
│   ├── source_code.ts    # Extractor de exportaciones y símbolos
│   ├── source_code_ast.ts# Analizador léxico y AST de TypeScript
│   ├── tests.ts          # Detecta frameworks y archivos de test
│   └── workflows.ts      # Lee y parsea GitHub Actions en .github/workflows/
│
├── generators/           # Generadores de secciones en Markdown
│   ├── api.ts            # Formatea la documentación de funciones y tipos
│   ├── badges.ts         # Construye URLs de badges (shields.io)
│   ├── examples.ts       # Genera snippets de código de ejemplo
│   └── toc.ts            # Construye la tabla de contenidos interactiva
│
├── templates/            # Motor y archivos de plantillas
│   ├── minimal.md        # Plantilla compacta
│   ├── modern.md         # Plantilla estándar moderna
│   ├── detailed.md       # Plantilla exhaustiva con todas las secciones
│   ├── load.ts           # Cargador de plantillas locales
│   └── render.ts         # Motor de renderizado y reemplazo {{placeholders}}
│
└── utils/                # Utilidades auxiliares
    ├── file_system.ts    # Verificaciones de escritura y permisos
    ├── init_wizard.ts    # Asistente interactivo por consola
    ├── logger.ts         # Mensajes con formato, colores y estados
    ├── readme_infer.ts   # Inferencia de descripciones desde READMEs existentes
    └── user_config.ts    # Carga y validación de .readmegen.json
```

---

## 🧩 Responsabilidad de los Componentes

### 1. Interfaz de Línea de Comandos (`src/main.ts`)

Construida con `@cliffy/command`, gestiona los parámetros del usuario:

- `--template`: Selecciona el estilo de plantilla a aplicar.
- `--output`: Define la ruta del archivo de destino.
- `--force`: Permite sobrescribir archivos protegidos.
- Subcomando `init`: Lanza el asistente guiado para crear `.readmegen.json`.

### 2. Coordinador de Análisis (`src/project/analyze.ts`)

Es el cerebro del análisis. Ejecuta en paralelo (`Promise.all`) la lectura de todos los aspectos del repositorio:

- Extrae la versión de Deno y scripts de tareas de `deno.json`.
- Detecta si existen suites de pruebas automáticas.
- Analiza los workflows de GitHub Actions para asociar las insignias de build correspondientes.
- Consolida todos los datos en una estructura unificada `TemplateData`.

### 3. Sistema de Sanitización (`src/mod.ts`)

Para evitar que código TypeScript de depuración o comentarios de desarrollo terminen en el archivo Markdown final, `sanitizeGeneratedMarkdown` aplica filtros mediante expresiones regulares que eliminan:

- Caracteres invisibles y Byte Order Marks (BOM: `\uFEFF`, `\u200B`).
- Líneas residuales de código fuente (`export type`, `import ...`).
- Espaciado redundante y saltos de línea consecutivos.
