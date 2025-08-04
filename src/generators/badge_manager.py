from typing import Dict

class BadgeManager:
    def __init__(self, badges: Dict[str, str]):
        self.badges = badges

    def generate_badges(self) -> str:
        return " ".join(
            f'![{tech}]({url})'
            for tech, url in self.badges.items()
        )
