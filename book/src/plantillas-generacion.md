# Motor de Plantillas y Generación

El subsistema de plantillas (`src/templates/`) es el encargado de transformar los datos recopilados durante el análisis en un documento Markdown estructurado y estéticamente cuidado.

---

## 📑 Plantillas Disponibles

**ReadmeGen** incluye tres estilos de plantilla preconfigurados:

| Plantilla    | Archivo       | Descripción                                                                                                            |
| ------------ | ------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Minimal**  | `minimal.md`  | Estructura compacta para utilidades pequeñas o scripts sencillos.                                                      |
| **Modern**   | `modern.md`   | Plantilla equilibrada con badges, tabla de contenidos, instalación y ejemplos (por defecto).                           |
| **Detailed** | `detailed.md` | Plantilla completa con todas las secciones posibles: API completa, dependencias, CI/CD, tests y guías de contribución. |

---

## 🔄 Variables de Plantilla (Placeholders)

Las plantillas utilizan una sintaxis de doble llave `{{variable}}` que es reemplazada dinámicamente por el motor de renderizado (`render.ts`):

- `{{projectName}}`: Nombre inferido del proyecto o directorio.
- `{{badges}}`: Cadena con todas las insignias SVG formateadas.
- `{{description}}`: Descripción del proyecto extraída de `deno.json` o inferida del contexto.
- `{{toc}}`: Tabla de contenidos interactiva con enlaces ancla.
- `{{installation}}`: Comando recomendado de instalación (`deno install ...`).
- `{{usage}}`: Comando de ejecución principal (`deno task readme`).
- `{{basicExample}}`: Bloque de código con ejemplo de uso de la librería.
- `{{apiDocs}}`: Tablas con la documentación detallada de la API.
- `{{dependencies}}`: Listado de dependencias detectadas.
- `{{testCommand}}`: Comando para ejecutar pruebas unitarias.
- `{{contributing}}`: Sección de pautas para contribuyentes.
- `{{license}}`: Información de la licencia detectada.

---

## 🧠 Inyección Inteligente

En ocasiones, un usuario puede utilizar una plantilla personalizada (como `README.profile.md`) que no incluye explícitamente los placeholders estándar (`{{badges}}`, `{{apiDocs}}`).

Para resolver esto, `src/mod.ts` implementa **Inyección Inteligente**:

1. **Evitar Duplicados**: Si el documento ya tiene insignias manuales, el motor analiza las URLs de las imágenes y solo agrega aquellas insignias que no existan previamente.
2. **Posicionamiento Automático**: Si no hay `{{badges}}`, inyecta los badges automáticamente justo debajo del primer encabezado `# Titulo`.
3. **Secciones Desplegables**: Si existen datos de API o dependencias pero no hay placeholder, los adjunta al final del documento dentro de etiquetas `<details>` de HTML para no alterar la estructura visual original.
