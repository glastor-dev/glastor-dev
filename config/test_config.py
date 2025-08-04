# test_config.py
import pytest
import json
from pathlib import Path
from utils.file_utils import load_config

def test_load_template_config_ok():
    config_path = Path("config/template.json")
    config = load_config(config_path)
    assert "readme" in config
    readme = config["readme"]
    # Verifica claves principales
    for key in ["metadata", "about", "badges", "content", "footer", "translations", "styles", "achievements"]:
        assert key in readme, f"Missing key: {key}"
    # Verifica traducciones
    assert "en" in readme["translations"]
    assert "es" in readme["translations"]
    # Verifica que achievements sea una lista y tenga al menos un elemento con los campos requeridos
    achievements = readme.get("achievements", [])
    assert isinstance(achievements, list)
    if achievements:
        ach = achievements[0]
        for field in ["title", "year", "url"]:
            assert field in ach

def test_load_template_config_invalid_json(tmp_path):
    # Crea un archivo JSON inválido temporal
    bad_config = tmp_path / "bad_template.json"
    bad_config.write_text("{no es json}", encoding="utf-8")
    with pytest.raises(Exception):
        load_config(bad_config)

def test_load_template_config_not_found():
    # Prueba que lanza FileNotFoundError si el archivo no existe
    from utils.file_utils import load_config
    with pytest.raises(FileNotFoundError):
        load_config(Path("config/no_existe.json"))
