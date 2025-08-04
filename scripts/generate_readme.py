#!/usr/bin/env python3
import datetime
from pathlib import Path
import sys
import logging
from typing import Dict, Any

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('readme_generator.log'),
        logging.StreamHandler()
    ]
)

class ReadmeGenerator:
    def __init__(self):
        self.config = self.load_config()
        self.template = self.load_template()
        self.banner = self.load_banner()

    def load_config(self) -> Dict[str, Any]:
        """Load configuration"""
        return {
            "metadata": {
                "title": "Python & Cybersecurity Specialist",
                "subtitle": "Offensive Security | DevSecOps | Python Automation",
                "emoji": "🛡️",
                "version": "1.0.0"
            },
            # ... (resto de tu configuración)
        }

    def load_template(self) -> str:
        """Load README template"""
        template_path = Path(__file__).parent.parent / "templates" / "readme_template.md"
        try:
            with open(template_path, "r", encoding="utf-8") as f:
                return f.read()
        except Exception as e:
            logging.error(f"Failed to load template: {str(e)}")
            raise

    def load_banner(self) -> str:
        """Load ASCII banner"""
        banner_path = Path(__file__).parent / "banner.txt"
        try:
            with open(banner_path, "r", encoding="utf-8") as f:
                return f.read()
        except Exception as e:
            logging.warning(f"Failed to load banner: {str(e)}")
            return ""

    def generate(self) -> bool:
        """Generate README.md"""
        try:
            replacements = self.prepare_replacements()
            readme_content = self.apply_replacements(replacements)
            self.write_readme(readme_content)
            return True
        except Exception as e:
            logging.error(f"Generation failed: {str(e)}")
            return False

    def prepare_replacements(self) -> Dict[str, str]:
        """Prepare all template replacements"""
        today = datetime.datetime.now().strftime("%Y-%m-%d")
        return {
            "{{TITLE}}": self.config["metadata"]["title"],
            "{{SUBTITLE}}": self.config["metadata"]["subtitle"],
            # ... (todos tus placeholders)
        }

    def apply_replacements(self, replacements: Dict[str, str]) -> str:
        """Apply replacements to template"""
        content = self.template
        for placeholder, value in replacements.items():
            content = content.replace(placeholder, value)
        return content

    def write_readme(self, content: str):
        """Write final README.md"""
        readme_path = Path(__file__).parent.parent / "README.md"
        with open(readme_path, "w", encoding="utf-8") as f:
            f.write(content)
        logging.info(f"Successfully generated {readme_path}")

if __name__ == "__main__":
    generator = ReadmeGenerator()
    success = generator.generate()
    sys.exit(0 if success else 1)
