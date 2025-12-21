"""Tests for copyright generator"""

from datetime import datetime

import pytest

from src.utils.copyright_generator import CopyrightGenerator, get_copyright


class TestCopyrightGenerator:
    """Test suite for CopyrightGenerator"""

    @pytest.fixture
    def generator(self):
        """Create generator instance"""
        return CopyrightGenerator("Test Owner", 2010)

    def test_initialization(self, generator):
        """Test generator initialization"""
        assert generator.owner == "Test Owner"
        assert generator.start_year == 2010
        assert generator.current_year == datetime.now().year

    def test_year_range_same_year(self):
        """Test year range when start and current are same"""
        current_year = datetime.now().year
        generator = CopyrightGenerator("Test", current_year)
        assert generator._get_year_range() == str(current_year)

    def test_year_range_different_years(self, generator):
        """Test year range with different start and current years"""
        expected = f"2010-{datetime.now().year}"
        assert generator._get_year_range() == expected

    def test_generate_full_format(self, generator):
        """Test full copyright format"""
        result = generator.generate("full")
        assert "Copyright ©" in result
        assert "2010" in result
        assert "Test Owner" in result
        assert "All rights reserved" in result

    def test_generate_short_format(self, generator):
        """Test short copyright format"""
        result = generator.generate("short")
        assert "©" in result
        assert "2010" in result
        assert "Test Owner" in result
        assert "All rights reserved" not in result

    def test_generate_range_format(self, generator):
        """Test range-only format"""
        result = generator.generate("range")
        assert "2010" in result
        assert "Test Owner" not in result

    def test_generate_html_format(self, generator):
        """Test HTML format"""
        result = generator.generate("html")
        assert "&copy;" in result
        assert "2010" in result

    def test_generate_markdown_format(self, generator):
        """Test Markdown format"""
        result = generator.generate("markdown")
        assert "©" in result
        assert "2010" in result

    def test_generate_footer_without_license(self, generator):
        """Test footer generation without license"""
        result = generator.generate_footer(include_license=False)
        assert "©" in result
        assert "GPL" not in result

    def test_generate_footer_with_license(self, generator):
        """Test footer generation with license"""
        result = generator.generate_footer(include_license=True)
        assert "©" in result
        assert "GPL-3.0" in result

    def test_generate_header_without_project(self, generator):
        """Test header without project name"""
        result = generator.generate_header()
        assert "©" in result
        assert "Test Owner" in result

    def test_generate_header_with_project(self, generator):
        """Test header with project name"""
        result = generator.generate_header("My Project")
        assert "My Project" in result
        assert "©" in result

    def test_get_copyright_function(self):
        """Test convenience function"""
        result = get_copyright("Test User", 2020, "short")
        assert "©" in result
        assert "2020" in result
        assert "Test User" in result

    def test_default_start_year(self):
        """Test default start year"""
        generator = CopyrightGenerator("Test")
        assert generator.start_year == 2010
