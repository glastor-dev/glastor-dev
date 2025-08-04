from datetime import datetime
from pathlib import Path
import json
from typing import Dict, Any
from jinja2 import Environment, FileSystemLoader
from pydantic import BaseModel, ValidationError
from ..utils.file_handler import write_file
from ..utils.date_utils import format_date
from .badge_manager import BadgeManager

class ReadmeData(BaseModel):
    metadata: Dict[str, Any]
    about: Dict[str, Any]
    badges: Dict[str, str]
    content: Dict[str, Any]
    footer: Dict[str, Any]
    translations: Dict[str, Any]
    styles: Dict[str, str]
    achievements: list[Dict[str, Any]]

class ReadmeGenerator:
    def __init__(self, data_path: Path, output_dir: Path):
        self.output_dir = output_dir
        self.template_dir = Path(__file__).parent.parent.parent / "templates"
        self.env = Environment(
            loader=FileSystemLoader(self.template_dir),
            autoescape=True,
            trim_blocks=True,
            lstrip_blocks=True
        )
        self._load_data(data_path)
        self.badge_manager = BadgeManager(self.data.badges)

    def _load_data(self, data_path: Path):
        with open(data_path, 'r', encoding='utf-8') as f:
            raw_data = json.load(f)['readme']
            raw_data['metadata']['last_updated'] = format_date(datetime.now())
            self.data = ReadmeData(**raw_data)

    def generate_all(self):
        self._generate_readme("base.md.j2", "README.md")
        self._generate_readme("en.md.j2", "README_EN.md")
        self._generate_readme("es.md.j2", "README_ES.md")

    def _generate_readme(self, template_name: str, output_name: str):
        template = self.env.get_template(template_name)
        rendered = template.render(
            data=self.data.model_dump(),
            badges=self.badge_manager.generate_badges(),
            current_year=datetime.now().year
        )
        write_file(self.output_dir / output_name, rendered)
