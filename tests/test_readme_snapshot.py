from __future__ import annotations

import difflib
from pathlib import Path

from src.generators.readme_generator import ReadmeGenerator


def test_readme_matches_generated_output() -> None:
    repo_root = Path(__file__).resolve().parents[1]
    profile_path = repo_root / "src" / "data" / "profile.json"
    readme_path = repo_root / "README.md"

    generator = ReadmeGenerator(profile_path, output_dir=repo_root, quiet=True)
    rendered = generator.render_base()
    existing = readme_path.read_text(encoding="utf-8")

    if existing != rendered:
        diff = "\n".join(
            difflib.unified_diff(
                existing.splitlines(),
                rendered.splitlines(),
                fromfile="README.md",
                tofile="generated",
                lineterm="",
            )
        )
        raise AssertionError(
            "README.md está desactualizado. Ejecuta: "
            "python -m src.main generate src/data/profile.json\n\n" + diff
        )
