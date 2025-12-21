import os
import tempfile
from pathlib import Path

from rich.console import Console

console = Console()


def write_file(
    path: Path,
    content: str,
    verbose: bool = False,
    quiet: bool = False,
    console: Console | None = None,
) -> None:
    """Write content to file with error handling

    Args:
        path: Output file path
        content: Content to write
        verbose: Show detailed output

    Raises:
        IOError: If file cannot be written
    """
    try:
        # Ensure parent directory exists
        path.parent.mkdir(parents=True, exist_ok=True)

        active_console = console or globals().get("console") or Console()

        # Atomic write to avoid partial/garbled files.
        with tempfile.NamedTemporaryFile(
            mode="w",
            encoding="utf-8",
            delete=False,
            dir=str(path.parent),
            prefix=f".{path.name}.",
            suffix=".tmp",
        ) as tmp:
            tmp.write(content)
            tmp_path = Path(tmp.name)

        os.replace(str(tmp_path), str(path))

        if quiet:
            return

        if verbose:
            lines = content.count("\n")
            active_console.print(
                f"[dim]✓ {path.name}: {len(content)} chars, {lines} lines[/dim]"
            )
        else:
            active_console.print(f"[blue]📄 {path.name} created successfully![/blue]")

    except PermissionError:
        (console or globals().get("console") or Console()).print(
            f"[red]❌ Permission denied: {path}[/red]"
        )
        raise
    except OSError as e:
        (console or globals().get("console") or Console()).print(
            f"[red]❌ Error writing {path}: {str(e)}[/red]"
        )
        raise


def read_file(path: Path, encoding: str = "utf-8") -> str:
    """Read file content with error handling

    Args:
        path: File path to read
        encoding: File encoding (default: utf-8)

    Returns:
        File content as string

    Raises:
        FileNotFoundError: If file doesn't exist
        IOError: If file cannot be read
    """
    try:
        with open(path, encoding=encoding) as f:
            return f.read()
    except FileNotFoundError:
        console.print(f"[red]❌ File not found: {path}[/red]")
        raise
    except OSError as e:
        console.print(f"[red]❌ Error reading {path}: {str(e)}[/red]")
        raise
