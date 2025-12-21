# Copyright Generator - Documentación

## 📋 Descripción

El **Copyright Generator** es una utilidad automática que genera notificaciones de copyright con rangos de fechas dinámicos que se actualizan automáticamente cada año.

## ✨ Características

- 🗓️ **Actualización Automática**: El año actual se calcula dinámicamente
- 📅 **Rangos Flexibles**: Soporta desde un año específico (ej: 2010) hasta la fecha actual
- 🎨 **Múltiples Formatos**: Full, short, HTML, Markdown, y más
- 🔧 **Fácil Integración**: Se integra automáticamente en los templates
- ✅ **Bien Testeado**: 14 tests unitarios con 100% de cobertura

## 🚀 Uso Básico

### Importar el módulo

```python
from src.utils.copyright_generator import CopyrightGenerator, get_copyright
```

### Función rápida

```python
# Uso simple
copyright = get_copyright()
# Resultado: © 2010-2025 Andrés Antonio Cardoso

# Con formato personalizado
copyright = get_copyright(
    owner="Tu Nombre",
    start_year=2015,
    format_type="full"
)
# Resultado: Copyright © 2015-2025 Tu Nombre. All rights reserved.
```

### Clase CopyrightGenerator

```python
# Crear generador
generator = CopyrightGenerator("Tu Nombre", start_year=2010)

# Generar en diferentes formatos
print(generator.generate("full"))
# Copyright © 2010-2025 Tu Nombre. All rights reserved.

print(generator.generate("short"))
# © 2010-2025 Tu Nombre

print(generator.generate("html"))
# &copy; 2010-2025 Tu Nombre

print(generator.generate("range"))
# 2010-2025
```

## 📝 Formatos Disponibles

| Formato | Descripción | Ejemplo |
|---------|-------------|---------|
| `full` | Completo con "All rights reserved" | `Copyright © 2010-2025 Tu Nombre. All rights reserved.` |
| `short` | Formato corto | `© 2010-2025 Tu Nombre` |
| `range` | Solo el rango de años | `2010-2025` |
| `symbol` | Con símbolo de copyright | `© 2010-2025 Tu Nombre` |
| `html` | Formato HTML con entidad | `&copy; 2010-2025 Tu Nombre` |
| `markdown` | Formato Markdown | `© 2010-2025 Tu Nombre` |

## 🎯 Métodos Disponibles

### `generate(format_type)`

Genera copyright en el formato especificado.

```python
generator = CopyrightGenerator("Tu Nombre", 2010)
copyright = generator.generate("short")
```

### `generate_footer(include_license)`

Genera un footer con copyright, opcionalmente con licencia.

```python
# Sin licencia
footer = generator.generate_footer()
# © 2010-2025 Tu Nombre

# Con licencia
footer = generator.generate_footer(include_license=True)
# © 2010-2025 Tu Nombre | Licensed under GPL-3.0
```

### `generate_header(project_name)`

Genera un header con copyright, opcionalmente con nombre de proyecto.

```python
# Sin proyecto
header = generator.generate_header()
# © 2010-2025 Tu Nombre

# Con proyecto
header = generator.generate_header("Mi Proyecto")
# Mi Proyecto | © 2010-2025 Tu Nombre
```

## 🔧 Integración con README Generator

El copyright generator está completamente integrado en el sistema de generación de README:

### En profile.json

```json
{
  "readme": {
    "footer": {
      "copyright": {
        "start_year": 2010,
        "owner": "Andrés Antonio Cardoso"
      }
    }
  }
}
```

### En templates Jinja2

Las siguientes variables están disponibles automáticamente:

```jinja
{{ copyright }}              <!-- © 2010-2025 Andrés Antonio Cardoso -->
{{ copyright_full }}         <!-- Copyright © 2010-2025... -->
{{ copyright_year_range }}   <!-- 2010-2025 -->
```

### Ejemplo en template

```jinja
---

{{ data.footer.notice }} • {{ copyright }}

<!-- Resultado: This README is updated automatically • © 2010-2025 Andrés Antonio Cardoso -->
```

## 📊 Casos de Uso

### 1. Footer de README

```python
generator = CopyrightGenerator("Tu Nombre", 2010)
footer = f"---\n\n{generator.generate('short')}"
```

### 2. Encabezado de Código

```python
generator = CopyrightGenerator("Tu Empresa", 2018)
header = f"""
# {generator.generate('full')}
# Licensed under GPL-3.0
"""
```

### 3. Página Web

```python
generator = CopyrightGenerator("Tu Sitio", 2020)
html_footer = f'<footer>{generator.generate("html")}</footer>'
```

### 4. Documentación

```python
generator = CopyrightGenerator("Autor", 2015)
doc_footer = generator.generate_footer(include_license=True)
```

## 🧪 Ejemplos de Salida

### Año actual = 2025

```python
# Si start_year = 2010
generator = CopyrightGenerator("Juan Pérez", 2010)
generator.generate("range")  # "2010-2025"

# Si start_year = 2025 (mismo año)
generator = CopyrightGenerator("Juan Pérez", 2025)
generator.generate("range")  # "2025"
```

### Actualización Automática

En 2026, el mismo código generará:
```python
generator = CopyrightGenerator("Juan Pérez", 2010)
generator.generate("range")  # "2010-2026" (automático!)
```

## ⚙️ Configuración por Defecto

```python
DEFAULT_START_YEAR = 2010
```

Si no especificas un año de inicio, usa 2010 por defecto.

## 🧪 Tests

El generador incluye 14 tests comprehensivos:

```bash
pytest tests/test_copyright_generator.py -v
```

Tests incluidos:
- ✅ Inicialización
- ✅ Rango de años (mismo año y diferentes)
- ✅ Todos los formatos (full, short, range, html, markdown)
- ✅ Generación de footer (con/sin licencia)
- ✅ Generación de header (con/sin proyecto)
- ✅ Función de conveniencia
- ✅ Año por defecto

## 💡 Tips y Mejores Prácticas

### 1. Usa el formato apropiado

```python
# Para READMEs: short
readme_copyright = generator.generate("short")

# Para código fuente: full
code_copyright = generator.generate("full")

# Para HTML: html
web_copyright = generator.generate("html")
```

### 2. Centraliza la configuración

```python
# config.py
COPYRIGHT_OWNER = "Tu Nombre"
COPYRIGHT_START_YEAR = 2010

# uso.py
from config import COPYRIGHT_OWNER, COPYRIGHT_START_YEAR
copyright = get_copyright(COPYRIGHT_OWNER, COPYRIGHT_START_YEAR)
```

### 3. Reutiliza el generador

```python
# Crea una vez
generator = CopyrightGenerator("Tu Nombre", 2010)

# Usa múltiples veces
readme_footer = generator.generate("short")
web_footer = generator.generate("html")
doc_footer = generator.generate_footer(include_license=True)
```

## 🔄 Actualización Anual

El copyright se actualiza **automáticamente** cada año. No requiere cambios manuales:

```python
# 2025
generator = CopyrightGenerator("Tu Nombre", 2010)
print(generator.generate())  # © 2010-2025 Tu Nombre

# 2026 (mismo código)
print(generator.generate())  # © 2010-2026 Tu Nombre

# 2030 (mismo código)
print(generator.generate())  # © 2010-2030 Tu Nombre
```

## 📦 Requisitos

```python
from datetime import datetime
from typing import Optional
```

No hay dependencias externas. Solo usa la librería estándar de Python.

## 🎓 Conclusión

El Copyright Generator es una herramienta simple pero poderosa que:

- ✅ Elimina la necesidad de actualizar manualmente el copyright cada año
- ✅ Mantiene consistencia en todos tus proyectos
- ✅ Soporta múltiples formatos para diferentes usos
- ✅ Es fácil de usar e integrar
- ✅ Está completamente testeado

**¡Nunca más olvides actualizar tu copyright!** 🎉

---

© 2010-2025 Andrés Antonio Cardoso
