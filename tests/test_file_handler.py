"""Unit tests for file_handler utilities"""

import shutil
import tempfile
from pathlib import Path

import pytest

from src.utils.file_handler import read_file, write_file


class TestFileHandler:
    """Test suite for file handler utilities"""

    @pytest.fixture
    def temp_dir(self):
        """Create temporary directory for tests"""
        temp_path = Path(tempfile.mkdtemp())
        yield temp_path
        shutil.rmtree(temp_path)

    def test_write_file(self, temp_dir):
        """Test writing file"""
        test_file = temp_dir / "test.txt"
        content = "Test content\nLine 2"

        write_file(test_file, content)

        assert test_file.exists()
        assert test_file.read_text(encoding="utf-8") == content

    def test_write_file_creates_directory(self, temp_dir):
        """Test that write_file creates parent directories"""
        test_file = temp_dir / "subdir" / "test.txt"
        content = "Test content"

        write_file(test_file, content)

        assert test_file.exists()
        assert test_file.parent.exists()

    def test_read_file(self, temp_dir):
        """Test reading file"""
        test_file = temp_dir / "test.txt"
        content = "Test content"
        test_file.write_text(content, encoding="utf-8")

        result = read_file(test_file)

        assert result == content

    def test_read_nonexistent_file(self, temp_dir):
        """Test reading non-existent file raises error"""
        test_file = temp_dir / "nonexistent.txt"

        with pytest.raises(FileNotFoundError):
            read_file(test_file)

    def test_write_file_verbose(self, temp_dir):
        """Test writing file in verbose mode"""
        test_file = temp_dir / "test.txt"
        content = "Test content\nLine 2\nLine 3"

        # Should not raise any errors
        write_file(test_file, content, verbose=True)
        assert test_file.exists()
