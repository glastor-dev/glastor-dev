"""Unit tests for date utilities"""

from datetime import datetime

from src.utils.date_utils import format_date


class TestDateUtils:
    """Test suite for date utility functions"""

    def test_format_date(self):
        """Test date formatting"""
        test_date = datetime(2025, 12, 20, 15, 30, 45)
        result = format_date(test_date)

        assert isinstance(result, str)
        assert "2025-12-20" in result
        assert "15:30" in result

    def test_format_date_now(self):
        """Test formatting current date"""
        result = format_date(datetime.now())

        assert isinstance(result, str)
        assert len(result) > 0
        # Should contain date separator
        assert "-" in result
        # Should contain time separator
        assert ":" in result
