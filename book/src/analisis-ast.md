# Análisis de Proyectos y AST

Uno de los aspectos técnicos más avanzados de **Glastor ReadmeGen** es su capacidad para inspeccionar estáticamente el código TypeScript sin necesidad de ejecutarlo, extrayendo metadatos precisos mediante análisis sintáctico.

---

## 🔍 Análisis AST (`source_code_ast.ts`)

El archivo `src/parsers/source_code_ast.ts` implementa un analizador que recorre el código fuente de los archivos `.ts` para descubrir símbolos públicos:

### 1. Extracción de Funciones Exportadas

El analizador detecta declaraciones de funciones públicas:

```ts
export function generateReadme(args: GenerateReadmeArgs): Promise<void>;
```

Extrayendo:

- Nombre de la función (`generateReadme`).
- Lista de parámetros tipados (`args: GenerateReadmeArgs`).
- Tipo de retorno (`Promise<void>`).
- Bloques JSDoc asociados (`/** ... */`).

### 2. Extracción de Tipos e Interfaces

Identifica estructuras de datos clave:

```ts
export interface GenerateReadmeArgs {
  template: TemplateName | string;
  output: string;
  force: boolean;
}
```

Generando tablas que documentan cada propiedad, su tipo y si es obligatoria u opcional.

---

## 📦 Análisis de Dependencias (`imports.ts`)

El analizador de importaciones examina las declaraciones de dependencias en todo el proyecto:

- **Dependencias JSR** (`jsr:@std/path`, `jsr:@cliffy/command`).
- **Dependencias Deno.land** (`https://deno.land/std/...`).
- **Dependencias NPM** (`npm:chalk`, `npm:fast-glob`).
- **Importaciones locales relativas** (`./utils/...`).

Esto permite generar automáticamente la sección de **Dependencies** en el README sin requerir que el desarrollador las enumere a mano.

---

## 🤖 Detección de CI/CD y Workflows (`workflows.ts`)

El parser inspecciona la carpeta `.github/workflows/` en busca de archivos `.yml` o `.yaml`:

- Detecta si existe un flujo de pruebas o integración continua (`ci.yml`, `test.yml`).
- Vincula automáticamente el badge de estado correspondiente:
  ```markdown
  ![Build Status](https://github.com/usuario/repo/actions/workflows/ci.yml/badge.svg?branch=master)
  ```
- Si se configuran ramas personalizadas en `.readmegen.json`, el parser adapta los parámetros del badge para apuntar a la rama objetivo.
