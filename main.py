import logging
from pathlib import Path
import json
from jsonschema import validate, ValidationError
from modules.github_api import GitHubAPI
from modules.generator import READMEGenerator
from modules.renderer import MarkdownRenderer
from utils.file_utils import load_config, save_readme
from utils.logging_utils import configure_logging

def main():
    """
    Flujo principal para generar el README dinámico.
    """
    # Cargar configuración
    try:
        config = load_config(Path("config/template.json"))
    except Exception as e:
        logging.error(f"Error al cargar configuración: {str(e)}")
        return

    # Validar contra el schema antes de continuar
    try:
        with open("config/template_schema.json", "r", encoding="utf-8") as f:
            schema = json.load(f)
        validate(instance=config, schema=schema)
        logging.info("La configuración es válida según el schema.")
    except ValidationError as e:
        logging.error(f"Error de validación en template.json: {e.message}")
        return
    except Exception as e:
        logging.error(f"Error al cargar el schema: {str(e)}")
        return

    # Configurar logging desde config si existe
    logging_cfg = config.get("logging", {})
    configure_logging(
        log_file=logging_cfg.get("log_file", "github_readme.log"),
        level=logging_cfg.get("level", logging.INFO),
        rotate=logging_cfg.get("rotate", False)
    )

    github_user = config.get("github_user")
    if not github_user:
        logging.error("No se encontró la clave 'github_user' en la configuración.")
        return

    try:
        github_api = GitHubAPI(github_user)
        renderer = MarkdownRenderer()
        generator = READMEGenerator(github_api, renderer)

        readme_content = generator.generate(config)
        output_path = Path(config.get("output_path", "README.md"))
        save_readme(output_path, readme_content)

        logging.info("README generado exitosamente")
    except Exception as e:
        logging.error(f"Error al generar README: {str(e)}")
        raise

if __name__ == "__main__":
    main()
