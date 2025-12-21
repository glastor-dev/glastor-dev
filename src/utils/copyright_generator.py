"""Automatic copyright generator utility"""

from datetime import datetime


class CopyrightGenerator:
    """Generate copyright notices with automatic date ranges"""

    DEFAULT_START_YEAR = 2010

    def __init__(self, owner: str, start_year: int | None = None):
        """
        Initialize copyright generator

        Args:
            owner: Copyright owner name
            start_year: Starting year (defaults to 2010)
        """
        self.owner = owner
        self.start_year = start_year or self.DEFAULT_START_YEAR
        self.current_year = datetime.now().year

    def generate(self, format_type: str = "full") -> str:
        """
        Generate copyright notice

        Args:
            format_type: Type of copyright format
                - 'full': Full copyright notice
                - 'short': Short format
                - 'range': Just the year range
                - 'symbol': With copyright symbol

        Returns:
            Formatted copyright string
        """
        year_range = self._get_year_range()

        formats = {
            "full": f"Copyright © {year_range} {self.owner}. All rights reserved.",
            "short": f"© {year_range} {self.owner}",
            "range": year_range,
            "symbol": f"© {year_range} {self.owner}",
            "html": f"&copy; {year_range} {self.owner}",
            "markdown": f"© {year_range} {self.owner}",
        }

        return formats.get(format_type, formats["full"])

    def _get_year_range(self) -> str:
        """Get formatted year range"""
        if self.start_year == self.current_year:
            return str(self.current_year)
        return f"{self.start_year}-{self.current_year}"

    def generate_footer(self, include_license: bool = False) -> str:
        """
        Generate footer with copyright

        Args:
            include_license: Include license notice

        Returns:
            Formatted footer string
        """
        copyright_text = self.generate("short")

        if include_license:
            return f"{copyright_text} | Licensed under GPL-3.0"

        return copyright_text

    def generate_header(self, project_name: str | None = None) -> str:
        """
        Generate header with copyright

        Args:
            project_name: Optional project name

        Returns:
            Formatted header string
        """
        year_range = self._get_year_range()

        if project_name:
            return f"{project_name} | © {year_range} {self.owner}"

        return f"© {year_range} {self.owner}"


def get_copyright(
    owner: str = "Andrés Antonio Cardoso",
    start_year: int = 2010,
    format_type: str = "short",
) -> str:
    """
    Quick function to get copyright notice

    Args:
        owner: Copyright owner name
        start_year: Starting year
        format_type: Format type (full, short, range, symbol, html, markdown)

    Returns:
        Formatted copyright string

    Examples:
        >>> get_copyright()
        '© 2010-2025 Andrés Antonio Cardoso'

        >>> get_copyright(format_type="full")
        'Copyright © 2010-2025 Andrés Antonio Cardoso. All rights reserved.'
    """
    generator = CopyrightGenerator(owner, start_year)
    return generator.generate(format_type)


if __name__ == "__main__":
    # Demo
    print("=== Copyright Generator Demo ===\n")

    generator = CopyrightGenerator("Andrés Antonio Cardoso", 2010)

    print("Full format:")
    print(generator.generate("full"))
    print()

    print("Short format:")
    print(generator.generate("short"))
    print()

    print("Range only:")
    print(generator.generate("range"))
    print()

    print("HTML format:")
    print(generator.generate("html"))
    print()

    print("Footer:")
    print(generator.generate_footer(include_license=True))
    print()

    print("Header:")
    print(generator.generate_header("README Generator"))
