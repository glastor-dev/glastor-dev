# Referencia de la API

Además de utilizarse como herramienta CLI, **Glastor ReadmeGen** puede integrarse como biblioteca en cualquier aplicación o script de Deno a través de `src/mod.ts`.

---

## 🚀 Importación

```ts
import { generateReadme, sanitizeGeneratedMarkdown } from "./src/mod.ts";
```

---

## 📘 Funciones Principales

### `generateReadme(args: GenerateReadmeArgs): Promise<void>`

Orquesta el análisis completo del repositorio y escribe el archivo de salida formateado.

#### Parámetros (`GenerateReadmeArgs`)

| Propiedad  | Tipo                     | Obligatorio | Descripción                                                                              |
| ---------- | ------------------------ | ----------- | ---------------------------------------------------------------------------------------- |
| `template` | `TemplateName \| string` | No          | Nombre de la plantilla (`"minimal"`, `"modern"`, `"detailed"`). Por defecto: `"modern"`. |
| `output`   | `string`                 | Sí          | Ruta donde se escribirá el archivo Markdown generado (ej. `"README.md"`).                |
| `force`    | `boolean`                | Sí          | Si es `true`, sobrescribe el archivo existente sin lanzar advertencia.                   |

#### Ejemplo de Uso

```ts
import { generateReadme } from "./src/mod.ts";

await generateReadme({
  template: "modern",
  output: "README.md",
  force: true,
});

console.log("¡README generado con éxito!");
```

---

### `sanitizeGeneratedMarkdown(markdown: string): string`

Limpia y normaliza el texto Markdown generado para garantizar su presentación óptima.

- Elimina caracteres especiales de inicio de archivo (BOM, zero-width spaces).
- Filtra líneas residuales de código fuente que hayan podido escapar al parser.
- Normaliza los saltos de línea a formato Unix (`LF`).

#### Parámetros

| Parámetro  | Tipo     | Descripción                  |
| ---------- | -------- | ---------------------------- |
| `markdown` | `string` | Texto Markdown sin procesar. |

#### Retorno

Devuelve el string sanitizado y listo para ser persistido en disco.

---

## 🔬 Análisis de Proyecto (`src/project/analyze.ts`)

### `analyzeProject(options: AnalyzeProjectOptions): Promise<ProjectAnalysis>`

Función de bajo nivel que ejecuta los parsers e inspectores estáticos sobre una carpeta de proyecto.

```ts
import { analyzeProject } from "./src/project/analyze.ts";

const analysis = await analyzeProject({
  projectRoot: Deno.cwd(),
  readmePath: "./README.md",
});

console.log("Metadatos extraídos:", analysis.templateData);
```
