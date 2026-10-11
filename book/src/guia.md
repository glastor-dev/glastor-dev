# Guía de Uso del CLI

El CLI de **Glastor ReadmeGen** ofrece comandos intuitivos tanto para generar documentación de forma automática como para inicializar proyectos desde cero.

---

## 🛠️ Comando Principal

```bash
readmegen [opciones]
```

### Opciones Disponibles

| Opción       | Alias | Valor por Defecto | Descripción                                                      |
| ------------ | ----- | ----------------- | ---------------------------------------------------------------- |
| `--template` | `-t`  | `modern`          | Estilo de plantilla a aplicar (`minimal`, `modern`, `detailed`). |
| `--output`   | `-o`  | `README.md`       | Ruta del archivo de salida a generar.                            |
| `--force`    | `-f`  | `false`           | Sobrescribe el archivo de destino si ya existe.                  |
| `--help`     | `-h`  | -                 | Muestra la ayuda y opciones disponibles.                         |
| `--version`  | `-V`  | -                 | Muestra la versión actual de la herramienta.                     |

---

## 📋 Ejemplos de Uso

### 1. Generación Básica

Genera el archivo `README.md` utilizando la plantilla moderna:

```bash
readmegen
```

### 2. Seleccionar Plantilla Específica

Genera un README exhaustivo con toda la información de API y dependencias:

```bash
readmegen --template detailed
```

Para utilidades pequeñas donde solo se necesita lo esencial:

```bash
readmegen --template minimal
```

### 3. Generar en un Archivo Diferente

Para generar un borrador o previsualización sin alterar el README principal:

```bash
readmegen --output PREVIEW.md --force
```

---

## 🧙 Asistente de Configuración (`readmegen init`)

Si deseas personalizar el comportamiento del generador en tu proyecto, ejecuta el asistente guiado:

```bash
readmegen init
```

Este comando inicia una sesión interactiva en la terminal que te solicitará:

1. **Nombre del proyecto**: Nombre visible en los títulos.
2. **Descripción breve**: Resumen de una línea para el encabezado.
3. **Repositorio de GitHub**: En formato `usuario/repo` para generar enlaces y badges.
4. **Estilo de insignias**: `flat`, `flat-square`, `plastic`, etc.
5. **Secciones opcionales**: Activar o desactivar tablas de API, tests o dependencias.

Al finalizar, el asistente creará automáticamente el archivo `.readmegen.json` en la raíz de tu proyecto.
