"""Unit tests for BadgeManager"""

import pytest

from src.generators.badge_manager import BadgeManager


class TestBadgeManager:
    """Test suite for BadgeManager class"""

    @pytest.fixture
    def sample_badges(self):
        """Sample badge data for testing"""
        return {
            "Python": "https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white",
            "Django": "https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white",
        }

    @pytest.fixture
    def badge_manager(self, sample_badges):
        """Create BadgeManager instance"""
        return BadgeManager(sample_badges)

    def test_initialization(self, sample_badges):
        """Test BadgeManager initialization"""
        manager = BadgeManager(sample_badges)
        assert manager.badges == sample_badges
        assert manager.style == "for-the-badge"

    def test_generate_markdown_badges(self, badge_manager):
        """Test Markdown badge generation"""
        result = badge_manager.generate_badges("markdown")
        assert "![Python]" in result
        assert "![Django]" in result
        assert "https://img.shields.io" in result

    def test_generate_html_badges(self, badge_manager):
        """Test HTML badge generation"""
        result = badge_manager.generate_badges("html")
        assert "<img src=" in result
        assert 'alt="Python"' in result
        assert 'alt="Django"' in result

    def test_get_badge_url(self, badge_manager):
        """Test getting specific badge URL"""
        url = badge_manager.get_badge_url("Python")
        assert url is not None
        assert "Python" in url

        # Test non-existent badge
        assert badge_manager.get_badge_url("NonExistent") is None

    def test_add_badge(self, badge_manager):
        """Test adding new badge"""
        new_url = "https://img.shields.io/badge/Flask-000000?style=for-the-badge"
        badge_manager.add_badge("Flask", new_url)

        assert "Flask" in badge_manager.badges
        assert badge_manager.get_badge_url("Flask") == new_url

    def test_get_technologies(self, badge_manager):
        """Test getting list of technologies"""
        techs = badge_manager.get_technologies()
        assert "Python" in techs
        assert "Django" in techs
        assert len(techs) == 2
