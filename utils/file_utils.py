from pathlib import Path
import json
from typing import Dict, Any
import logging

def load_config(config_path: Path) -> Dict[str, Any]:
    """
    Carga el archivo de configuración JSON.
    :param config_path: Ruta al archivo de configuración.
    :return: Diccionario con la configuración.
    :raises FileNotFoundError: Si el archivo no existe.
    :raises json.JSONDecodeError: Si el archivo no es un JSON válido.
    """
    if not config_path.exists():
        logging.error(f"El archivo de configuración no existe: {config_path}")
        raise FileNotFoundError(f"Config file not found: {config_path}")
    try:
        with open(config_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except json.JSONDecodeError as e:
        logging.error(f"Error de formato JSON en {config_path}: {str(e)}")
        raise
    except Exception as e:
        logging.error(f"Error al cargar configuración: {str(e)}")
        raise

def save_readme(output_path: Path, content: str) -> None:
    """
    Guarda el README generado.
    :param output_path: Ruta de salida del archivo README.
    :param content: Contenido a guardar.
    :raises Exception: Si ocurre un error al guardar.
    """
    try:
        output_path.parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(content)
    except Exception as e:
        logging.error(f"Error al guardar README: {str(e)}")
        raise
