# Examples

This file contains usage examples for the README Generator.

## Basic Usage

### Generate a single README (default)

```bash
# Genera un único README.md (usa el idioma configurado en el JSON)
python -m src.main generate src/data/profile.json
```

### Generate all variants

```bash
# Genera README.md + README_EN.md + README_ES.md
python -m src.main generate src/data/profile.json --lang all
```

## Language-Specific Generation

### Generate only English version

```bash
# Genera README.md en inglés
python -m src.main generate src/data/profile.json --lang en
```

### Generate only Spanish version

```bash
# Genera README.md en español
python -m src.main generate src/data/profile.json --lang es
```

## Output Directory

### Specify custom output directory

```bash
python -m src.main generate src/data/profile.json --output-dir ./docs
```

This will create the README files in the `docs/` directory.

## Verbose Mode

### See detailed generation information

```bash
python -m src.main generate src/data/profile.json --verbose
```

## Output File / Stdout

### Write to a custom output path

```bash
python -m src.main generate src/data/profile.json --output ./README_CUSTOM.md
```

### Print to stdout (useful for piping)

```bash
python -m src.main generate src/data/profile.json --stdout
```

## CI / Check Mode

### Fail if README is out of date

```bash
python -m src.main generate src/data/profile.json --check
```

Output:
```
📂 Data file: src\data\profile.json
📁 Output directory: .
✓ Loaded data from profile.json
✓ Found 6 badges
✓ README.md: 2189 chars, 31 lines
✓ README_EN.md: 1919 chars, 23 lines
✓ README_ES.md: 1935 chars, 22 lines
...
```

## Validation

### Validate JSON structure without generating files

```bash
python -m src.main validate src/data/profile.json
```

### Strict validation (fail on unknown fields)

```bash
python -m src.main validate src/data/profile.json --strict
```

## Schema

### Print JSON Schema

```bash
python -m src.main schema
```

### Write JSON Schema to a file

```bash
python -m src.main schema --output ./profile.schema.json
```

Output on success:
```
🔍 Validating: src\data\profile.json
✅ JSON data is valid!
```

Output on error:
```
🔍 Validating: src\data\profile.json
❌ Validation failed: metadata must contain 'title'
```

## Version Information

### Display version and author info

```bash
python -m src.main version
```

Output:
```
README Generator v1.0.0
Professional README file generator from JSON data

Author: Andrés Antonio Cardoso
```

## Combined Options

### Generate English README in docs folder with verbose output

```bash
python -m src.main generate src/data/profile.json --lang en --output-dir ./docs --verbose
```

## Custom JSON Data

### Create your own profile.json

```json
{
  "readme": {
    "metadata": {
      "title": "John Doe - Software Engineer",
      "subtitle": "Full Stack Developer | Open Source Enthusiast",
      "emoji": "🚀",
      "version": "1.0.0"
    },
    "about": {
      "description": "Passionate developer focused on building great software.",
      "core_skills": {
        "languages": ["Python", "JavaScript", "Go"],
        "frameworks": ["React", "Django", "FastAPI"]
      }
    },
    "badges": {
      "Python": "https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white",
      "React": "https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"
    },
    "content": {
      "header": {
        "image": "https://your-banner-url.com/banner.jpg",
        "link": "https://github.com/yourusername"
      },
      "quote": {
        "text": "Code is poetry.",
        "author": "Anonymous",
        "icon": "💻"
      },
      "contact": {
        "links": [
          {
            "platform": "GitHub",
            "url": "https://github.com/yourusername",
            "icon": "https://path-to-icon.svg"
          }
        ]
      }
    },
    "footer": {
      "notice": "This README is auto-generated",
      "copyright": {
        "year": 2025,
        "owner": "John Doe"
      }
    },
    "translations": {
      "en": {
        "about_title": "About Me",
        "projects_title": "Projects",
        "contact_title": "Contact"
      },
      "es": {
        "about_title": "Sobre mí",
        "projects_title": "Proyectos",
        "contact_title": "Contacto"
      }
    },
    "achievements": []
  }
}
```

Then generate with:
```bash
python -m src.main generate your-profile.json
```

## Error Handling

### File not found

```bash
python -m src.main nonexistent.json
```

Output:
```
❌ Error: File 'nonexistent.json' not found
```

### Invalid language

```bash
python -m src.main src/data/profile.json --lang fr
```

Output:
```
❌ Error: Invalid language 'fr'. Use 'en', 'es', or 'all'
```

### Invalid JSON

If your JSON is malformed, you'll get:
```
❌ Validation failed: Invalid JSON format: Expecting ',' delimiter: line 5 column 3 (char 89)
```

## Pro Tips

1. **Always validate first**: Use `validate` command before generating
2. **Use verbose mode**: When debugging or learning the tool
3. **Version control**: Add generated READMEs to `.gitignore` if they're auto-generated
4. **Custom templates**: Modify `.j2` files in `templates/` for custom styling
5. **Badges**: Use [shields.io](https://shields.io) for creating custom badges
