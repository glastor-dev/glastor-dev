# test_generator.py
import pytest
from modules.generator import READMEGenerator

class DummyGitHubAPI:
    def get_user_info(self):
        return {"login": "testuser"}
    def get_repos(self):
        return [
            {"name": "Repo1", "stargazers_count": 10, "pushed_at": "2024-01-01T00:00:00Z", "languages": {"Python": 100}},
            {"name": "Repo2", "stargazers_count": 5, "pushed_at": "2024-01-02T00:00:00Z", "languages": {"JavaScript": 50}}
        ]
    def get_filtered_repos(self, tag):
        return self.get_repos()
    def get_repo_languages(self, repo_name):
        return {"Python": 100}

class DummyRenderer:
    def render_header(self, title, subtitle="", emoji=""):
        return f"# {title} {emoji}\n{subtitle}\n"
    def render_projects(self, title, repos, show_tech_tags=True, show_stars=True):
        return f"## {title}\n" + "\n".join([r["name"] for r in repos])
    def render_contact(self, title, links):
        return f"## {title}\n" + "\n".join([l["platform"] for l in links])
    def render_hero(self, *args, **kwargs):
        return "Hero"
    def render_quote(self, *args, **kwargs):
        return "Quote"

def test_generate_readme():
    github_api = DummyGitHubAPI()
    renderer = DummyRenderer()
    generator = READMEGenerator(github_api, renderer)
    config = {
        "sections": [
            {"type": "header", "data": {"title": "Test", "subtitle": "Sub", "emoji": "🚀"}},
            {"type": "projects", "data": {"title": "Proyectos", "count": 2}},
            {"type": "contact", "data": {"title": "Contacto", "links": [{"platform": "GitHub", "url": "https://github.com/test", "icon": "icon.png"}]}}
        ],
        "categories": [{"tag": "python"}],
        "translations": {"en": {"projects_title": "Projects"}},
        "language": "en"
    }
    readme = generator.generate(config)
    assert "# Test 🚀" in readme
    assert "Repo1" in readme
    assert "Repo2" in readme
    assert "GitHub" in readme
