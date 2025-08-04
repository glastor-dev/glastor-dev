from pathlib import Path
from rich.console import Console

console = Console()

def write_file(path: Path, content: str):
    try:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        console.print(f"[blue]📄 {path.name} created successfully![/blue]")
    except IOError as e:
        console.print(f"[red]Error writing {path}: {str(e)}[/red]")
        raise
