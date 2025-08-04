# test_renderer.py
import pytest
from modules.renderer import MarkdownRenderer

def test_render_header():
    renderer = MarkdownRenderer()
    md = renderer.render_header("Título", "Subtítulo", "🚀")
    assert "# Título 🚀" in md
    assert "Subtítulo" in md

def test_render_hero():
    renderer = MarkdownRenderer()
    md = renderer.render_hero("img.png", "https://test.com", "left", 200, "Mi imagen")
    assert '<img src="img.png"' in md
    assert 'href="https://test.com"' in md
    assert "Mi imagen" in md

def test_render_quote():
    renderer = MarkdownRenderer()
    md = renderer.render_quote("Texto", "Autor", "💡")
    assert "> 💡 **Texto**" in md
    assert "Autor" in md

def test_render_projects():
    renderer = MarkdownRenderer()
    repos = [
        {
            "name": "Repo1",
            "html_url": "https://github.com/test/repo1",
            "description": "Descripción de prueba",
            "languages": {"Python": 1000, "JavaScript": 500},
            "stargazers_count": 5
        }
    ]
    md = renderer.render_projects("Proyectos", repos)
    assert "| [Repo1](https://github.com/test/repo1)" in md
    assert "Python" in md
    assert "⭐ 5" in md

def test_render_contact():
    renderer = MarkdownRenderer()
    links = [
        {"platform": "GitHub", "url": "https://github.com/test", "icon": "icon.png"}
    ]
    md = renderer.render_contact("Contacto", links)
    assert "icon.png" in md
    assert "GitHub" in md
