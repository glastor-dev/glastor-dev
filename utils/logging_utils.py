import logging
from typing import Optional

def configure_logging(
    log_file: Optional[str] = "github_readme.log",
    level: int = logging.INFO,
    rotate: bool = False,
    max_bytes: int = 5_000_000,
    backup_count: int = 3
) -> None:
    """
    Configura el sistema de logging.
    :param log_file: Ruta del archivo de log (opcional).
    :param level: Nivel de logging.
    :param rotate: Si True, usa RotatingFileHandler.
    :param max_bytes: Tamaño máximo del log antes de rotar.
    :param backup_count: Número de archivos de backup.
    """
    handlers = [logging.StreamHandler()]
    if log_file:
        if rotate:
            from logging.handlers import RotatingFileHandler
            handlers.append(RotatingFileHandler(log_file, maxBytes=max_bytes, backupCount=backup_count))
        else:
            handlers.append(logging.FileHandler(log_file))

    logging.basicConfig(
        level=level,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        handlers=handlers
    )
    logging.getLogger("requests").setLevel(logging.WARNING)
    logging.getLogger("urllib3").setLevel(logging.WARNING)
