class BadgeManager:
    """Manage technology badges generation"""

    BADGE_STYLES = {
        "default": "for-the-badge",
        "flat": "flat",
        "flat-square": "flat-square",
        "plastic": "plastic",
        "social": "social",
    }

    def __init__(self, badges: dict[str, str], style: str = "default"):
        self.badges = badges
        self.style = self.BADGE_STYLES.get(style, "for-the-badge")

    def generate_badges(self, format_type: str = "markdown") -> str:
        """Generate badges in specified format

        Args:
            format_type: Output format ('markdown' or 'html')

        Returns:
            Formatted badge string
        """
        if format_type == "html":
            return self._generate_html_badges()
        return self._generate_markdown_badges()

    def _generate_markdown_badges(self) -> str:
        """Generate badges in Markdown format"""
        return " ".join(f"![{tech}]({url})" for tech, url in self.badges.items())

    def _generate_html_badges(self) -> str:
        """Generate badges in HTML format"""
        badges_html = []
        for tech, url in self.badges.items():
            badges_html.append(f'<img src="{url}" alt="{tech}" />')
        return " ".join(badges_html)

    def get_badge_url(self, tech: str) -> str | None:
        """Get badge URL for specific technology

        Args:
            tech: Technology name

        Returns:
            Badge URL or None if not found
        """
        return self.badges.get(tech)

    def add_badge(self, tech: str, url: str) -> None:
        """Add a new badge

        Args:
            tech: Technology name
            url: Badge image URL
        """
        self.badges[tech] = url

    def get_technologies(self) -> list[str]:
        """Get list of all technologies

        Returns:
            List of technology names
        """
        return list(self.badges.keys())
