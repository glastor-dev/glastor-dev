import json
from contextlib import contextmanager
from datetime import datetime
from pathlib import Path
from typing import Any

from jinja2 import Environment, FileSystemLoader, TemplateNotFound
from pydantic import BaseModel, ConfigDict, Field, field_validator
from rich.console import Console

from ..utils.copyright_generator import CopyrightGenerator
from ..utils.date_utils import format_date
from ..utils.file_handler import write_file
from .badge_manager import BadgeManager

console = Console()


class ReadmeData(BaseModel):
    """Validated data model for README generation"""

    metadata: dict[str, Any] = Field(
        ..., description="Metadata including title, subtitle, version"
    )
    github_stats: dict[str, Any] = Field(
        default_factory=dict, description="GitHub stats settings"
    )
    about: dict[str, Any] = Field(
        ..., description="About section with description and skills"
    )
    badges: dict[str, str] = Field(
        default_factory=dict, description="Technology badges"
    )
    content: dict[str, Any] = Field(..., description="Content sections")
    footer: dict[str, Any] = Field(..., description="Footer information")
    translations: dict[str, Any] = Field(
        ..., description="Translations for different languages"
    )
    styles: dict[str, str] = Field(default_factory=dict, description="Styling options")
    achievements: list[dict[str, Any]] = Field(
        default_factory=list, description="List of achievements"
    )

    @field_validator("metadata")
    @classmethod
    def validate_metadata(cls, v):
        required = ["title", "subtitle"]
        for field in required:
            if field not in v:
                raise ValueError(f"metadata must contain '{field}'")
        return v


class ReadmeDataStrict(ReadmeData):
    model_config = ConfigDict(extra="forbid")


class ReadmeGenerator:
    """Professional README generator from JSON data"""

    def __init__(
        self,
        data_path: Path,
        output_dir: Path,
        verbose: bool = False,
        quiet: bool = False,
        console: Console | None = None,
    ):
        self.output_dir = output_dir
        self.verbose = verbose
        self.quiet = quiet
        self.console = console or Console(quiet=quiet)
        self.template_dir = Path(__file__).parent.parent.parent / "templates"

        if not self.template_dir.exists():
            raise FileNotFoundError(
                f"Templates directory not found: {self.template_dir}"
            )

        self.env = Environment(
            loader=FileSystemLoader(self.template_dir),
            autoescape=True,
            trim_blocks=True,
            lstrip_blocks=True,
        )

        # Add custom filters
        self.env.filters["format_skills"] = self._format_skills

        self._load_data(data_path)
        self.badge_manager = BadgeManager(self.data.badges)

        # Initialize copyright generator
        owner = self.data.footer.get("copyright", {}).get(
            "owner", "Andrés Antonio Cardoso"
        )
        start_year = self.data.footer.get("copyright", {}).get("start_year", 2010)
        self.copyright_gen = CopyrightGenerator(owner, start_year)

        if self.verbose:
            self.console.print(f"[dim]✓ Loaded data from {data_path.name}[/dim]")
            self.console.print(f"[dim]✓ Found {len(self.data.badges)} badges[/dim]")

    def _load_data(self, data_path: Path):
        """Load and validate JSON data"""
        try:
            with open(data_path, encoding="utf-8") as f:
                raw_data = json.load(f)

            if "readme" not in raw_data:
                raise ValueError("JSON file must contain 'readme' key")

            raw_data = raw_data["readme"]
            if isinstance(raw_data.get("metadata"), dict):
                if raw_data["metadata"].get("last_updated") in (None, "", "auto"):
                    raw_data["metadata"]["last_updated"] = format_date(datetime.now())
            self.data = ReadmeData(**raw_data)

        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON format: {str(e)}") from e
        except Exception as e:
            raise ValueError(f"Error loading data: {str(e)}") from e

    def generate_all(self, lang: str | None = None) -> list[Path]:
        """Generate all README files or specific language

        Args:
            lang: Language to generate ('en', 'es', or None for all)

        Returns:
            List of generated file paths
        """
        generated_files = []

        original_language = None
        if isinstance(self.data.metadata, dict):
            original_language = self.data.metadata.get("language")

        # Default behavior: generate a single README.md using base template
        if lang is None:
            generated_files.append(self._generate_readme("base.md.j2", "README.md"))
            return generated_files

        # Generate README.md in a specific language (override JSON language)
        if lang in {"en", "es"}:
            if isinstance(self.data.metadata, dict):
                self.data.metadata["language"] = lang
            generated_files.append(self._generate_readme("base.md.j2", "README.md"))
            if isinstance(self.data.metadata, dict) and original_language is not None:
                self.data.metadata["language"] = original_language
            return generated_files

        # Generate all variants
        if lang == "all":
            generated_files.append(self._generate_readme("base.md.j2", "README.md"))

            if isinstance(self.data.metadata, dict):
                self.data.metadata["language"] = "en"
            generated_files.append(self._generate_readme("base.md.j2", "README_EN.md"))

            if isinstance(self.data.metadata, dict):
                self.data.metadata["language"] = "es"
            generated_files.append(self._generate_readme("base.md.j2", "README_ES.md"))

            if isinstance(self.data.metadata, dict) and original_language is not None:
                self.data.metadata["language"] = original_language
            return generated_files

        return generated_files

    @contextmanager
    def _override_language(self, lang_override: str | None):
        original_language = None
        if isinstance(self.data.metadata, dict):
            original_language = self.data.metadata.get("language")

        if lang_override in {"en", "es"} and isinstance(self.data.metadata, dict):
            self.data.metadata["language"] = lang_override
        try:
            yield
        finally:
            if isinstance(self.data.metadata, dict) and original_language is not None:
                self.data.metadata["language"] = original_language

    def render_base(self, lang_override: str | None = None) -> str:
        """Render base template to a string (no file I/O)."""
        with self._override_language(lang_override):
            return self._render_template("base.md.j2")

    def write_rendered(self, output_path: Path, rendered: str) -> None:
        """Write rendered README to disk."""
        write_file(
            output_path,
            rendered,
            verbose=self.verbose,
            quiet=self.quiet,
            console=self.console,
        )

    def _render_template(self, template_name: str) -> str:
        try:
            template = self.env.get_template(template_name)
        except TemplateNotFound as e:
            raise FileNotFoundError(f"Template not found: {template_name}") from e

        return template.render(
            data=self.data.model_dump(),
            badges=self.badge_manager.generate_badges(),
            current_year=datetime.now().year,
            generated_date=format_date(datetime.now()),
            copyright=self.copyright_gen.generate("short"),
            copyright_full=self.copyright_gen.generate("full"),
            copyright_year_range=self.copyright_gen.generate("range"),
        )

    def _generate_readme(self, template_name: str, output_name: str) -> Path:
        """Generate a single README file from template"""
        rendered = self._render_template(template_name)
        output_path = self.output_dir / output_name
        self.write_rendered(output_path, rendered)
        return output_path

    @staticmethod
    def _format_skills(skills: list[str]) -> str:
        """Format skills list as comma-separated string"""
        return ", ".join(skills)
