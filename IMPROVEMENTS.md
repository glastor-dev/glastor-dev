# 🚀 Mejoras Implementadas — GLASTOR README Generator v1.0.0

## Notas de lanzamiento

Resumen de la release **v1.0.0 (2025-12-20)**.

Detalles completos (Added/Changed/Fixed):

- [CHANGELOG.md](CHANGELOG.md)

## Highlights

- CLI con comandos `generate`, `validate` y `version`
- Generación multi-idioma y selectiva con `--lang`
- Validación robusta con Pydantic y mensajes de error claros
- Salida enriquecida en terminal (tablas/estado)
- Suite de tests con pytest

## Enlaces útiles

- Documentación principal: [README.md](README.md)
- Ejemplos: [EXAMPLES.md](EXAMPLES.md)
- Contribuciones: [CONTRIBUTING.md](CONTRIBUTING.md)

## Verificación rápida

```bash
# ayuda CLI
python -m src.main --help

# validar perfil JSON
python -m src.main validate src/data/profile.json

# generar README (ejemplo)
python -m src.main generate src/data/profile.json --lang es --verbose

# tests
python -m pytest
```
