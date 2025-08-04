import typer
from rich.console import Console
from generators.readme_generator import ReadmeGenerator
from pathlib import Path

app = typer.Typer(help="Professional README Generator")
console = Console()

@app.command()
def generate(
    data_file: Path = typer.Argument(..., help="Path to JSON data file"),
    output_dir: Path = typer.Option(Path("."), help="Output directory")
):
    """Generate README files from JSON data"""
    try:
        generator = ReadmeGenerator(data_file, output_dir)
        generator.generate_all()
        console.print("[bold green]✅ README files generated successfully![/bold green]")
    except Exception as e:
        console.print(f"[bold red]❌ Error: {str(e)}[/bold red]")
        raise typer.Exit(1)

if __name__ == "__main__":
    app()
