import json
import os
import sys
from pathlib import Path

import typer
from rich.console import Console
from rich.table import Table

from src.generators.readme_generator import ReadmeGenerator

app = typer.Typer(
    help="Professional README Generator - Generate beautiful README files from JSON data"
)


def _make_console(*, quiet: bool) -> Console:
    # When running in CI/non-interactive shells, keep output minimal.
    is_tty = sys.stdout.isatty()
    is_ci = os.environ.get("CI", "false").lower() == "true"
    return Console(
        quiet=quiet or (not is_tty) or is_ci,
        force_terminal=is_tty or is_ci,
        no_color=not is_tty and not is_ci,
    )


def _resolve_output_path(
    output_dir: Path, output: Path | None, default_name: str
) -> Path:
    if output is None:
        return output_dir / default_name
    return output if output.is_absolute() else (output_dir / output)


@app.command()
def generate(
    data_file: Path = typer.Argument(..., help="Path to JSON data file", exists=True),
    output_dir: Path = typer.Option(
        Path("."), help="Output directory for generated files"
    ),
    lang: str = typer.Option(
        None,
        "--lang",
        "-l",
        help="Generate README in a language (en, es) or generate all (all). Default: single README.md using JSON language",
    ),
    output: Path | None = typer.Option(
        None,
        "--output",
        "-o",
        help="Output file path for single README (default: README.md). Ignored with --lang all",
    ),
    stdout: bool = typer.Option(
        False,
        "--stdout",
        help="Print the generated README to stdout (single README only)",
    ),
    check: bool = typer.Option(
        False, "--check", help="Exit non-zero if generation would change files"
    ),
    quiet: bool = typer.Option(
        False, "--quiet", "-q", help="Suppress non-error output"
    ),
    verbose: bool = typer.Option(False, "--verbose", "-v", help="Show detailed output"),
    ci: bool = typer.Option(
        False, "--ci", help="Enable CI mode for minimal logs and env overrides"
    ),
):
    """Generate README files from JSON data with customizable options"""

    try:
        # Permitir override de datos por variables de entorno (ejemplo: token de Codecov)
        if os.environ.get("CODECOV_TOKEN"):
            os.environ["CODECOV_TOKEN"] = os.environ["CODECOV_TOKEN"]

        console = _make_console(quiet=quiet or stdout or ci)

        # Validate data file
        if not data_file.exists():
            console.print(
                f"[bold red]❌ Error: File '{data_file}' not found[/bold red]"
            )
            raise typer.Exit(1)

        # Validate language option
        if lang and lang not in ["en", "es", "all"]:
            console.print(
                f"[bold red]❌ Error: Invalid language '{lang}'. Use 'en', 'es', or 'all'[/bold red]"
            )
            raise typer.Exit(1)

        if stdout and lang == "all":
            console.print(
                "[bold red]❌ Error: --stdout cannot be used with --lang all[/bold red]"
            )
            raise typer.Exit(1)

        # Create output directory if it doesn't exist
        output_dir.mkdir(parents=True, exist_ok=True)

        if verbose or ci:
            console.print(f"[blue]� Data file: {data_file}[/blue]")
            console.print(f"[blue]� Output directory: {output_dir}[/blue]")
            if ci:
                console.print(
                    "[yellow]CI mode enabled. Logs are minimal. Env vars can override config.[/yellow]"
                )

        generator = ReadmeGenerator(
            data_file,
            output_dir,
            verbose=verbose,
            quiet=quiet or stdout,
            console=console,
        )

        def _check_or_write(output_path: Path, rendered: str) -> Path | None:
            if stdout:
                typer.echo(rendered)
                return None

            if check:
                existing = (
                    output_path.read_text(encoding="utf-8")
                    if output_path.exists()
                    else None
                )
                if existing != rendered:
                    console.print(
                        f"[bold yellow]⚠ README out of date:[/bold yellow] {output_path}"
                    )
                    raise typer.Exit(1)
                return output_path

            generator.write_rendered(output_path, rendered)
            return output_path

        generated_files: list[Path] = []

        # Single README (default language from JSON)
        if lang is None:
            output_path = _resolve_output_path(output_dir, output, "README.md")
            rendered = generator.render_base()
            maybe_path = _check_or_write(output_path, rendered)
            if maybe_path:
                generated_files.append(maybe_path)

        # Single README overriding language
        elif lang in {"en", "es"}:
            output_path = _resolve_output_path(output_dir, output, "README.md")
            rendered = generator.render_base(lang_override=lang)
            maybe_path = _check_or_write(output_path, rendered)
            if maybe_path:
                generated_files.append(maybe_path)

        # All variants
        elif lang == "all":
            if output is not None:
                console.print(
                    "[bold red]❌ Error: --output cannot be used with --lang all[/bold red]"
                )
                raise typer.Exit(1)

            plan = [
                ("README.md", None),
                ("README_EN.md", "en"),
                ("README_ES.md", "es"),
            ]
            changed = False
            for filename, lang_override in plan:
                output_path = output_dir / filename
                rendered = generator.render_base(lang_override=lang_override)
                if check:
                    existing = (
                        output_path.read_text(encoding="utf-8")
                        if output_path.exists()
                        else None
                    )
                    if existing != rendered:
                        changed = True
                        console.print(
                            f"[bold yellow]⚠ README out of date:[/bold yellow] {output_path}"
                        )
                else:
                    generator.write_rendered(output_path, rendered)
                    generated_files.append(output_path)

            if check:
                raise typer.Exit(1 if changed else 0)

        # Display results in a table (only when writing files)
        if (not stdout) and (not check) and (not ci):
            table = Table(
                title="✅ Generated Files", show_header=True, header_style="bold green"
            )
            table.add_column("File", style="cyan")
            table.add_column("Status", justify="center")
            table.add_column("Size", justify="right")

            for file in generated_files:
                size = file.stat().st_size
                table.add_row(file.name, "✓", f"{size:,} bytes")

            console.print(table)
            console.print(
                "[bold green]✨ README files generated successfully![/bold green]"
            )
        elif ci:
            for file in generated_files:
                print(f"[CI] Generated: {file} ({file.stat().st_size} bytes)")
            print("[CI] README files generated successfully!")

    except FileNotFoundError as e:
        console.print(f"[bold red]❌ File not found: {str(e)}[/bold red]")
        raise typer.Exit(1) from e
    except ValueError as e:
        console.print(f"[bold red]❌ Validation error: {str(e)}[/bold red]")
        raise typer.Exit(1) from e
    except Exception as e:
        console.print(f"[bold red]❌ Unexpected error: {str(e)}[/bold red]")
        if verbose:
            console.print_exception()
        raise typer.Exit(1) from e


@app.command()
def validate(
    data_file: Path = typer.Argument(..., help="Path to JSON data file to validate"),
    strict: bool = typer.Option(False, "--strict", help="Fail on unknown/extra fields"),
):
    """Validate JSON data file structure without generating files"""
    try:
        import json

        from src.generators.readme_generator import ReadmeData, ReadmeDataStrict

        console = _make_console(quiet=False)
        console.print(f"[blue]� Validating: {data_file}[/blue]")

        with open(data_file, encoding="utf-8") as f:
            raw_data = json.load(f)["readme"]
            (ReadmeDataStrict if strict else ReadmeData)(**raw_data)

        console.print("[bold green]✅ JSON data is valid![/bold green]")

    except FileNotFoundError as e:
        console.print(f"[bold red]❌ File '{data_file}' not found[/bold red]")
        raise typer.Exit(1) from e
    except KeyError as e:
        console.print(f"[bold red]❌ Missing required field: {str(e)}[/bold red]")
        raise typer.Exit(1) from e
    except Exception as e:
        console.print(f"[bold red]❌ Validation failed: {str(e)}[/bold red]")
        raise typer.Exit(1) from e


@app.command()
def version():
    """Show version information"""
    console = _make_console(quiet=False)
    console.print("[bold cyan]README Generator v1.0.0[/bold cyan]")
    console.print("Professional README file generator from JSON data")
    console.print("\n[dim]Author: Andrés Antonio Cardoso[/dim]")


@app.command()
def schema(
    output: Path | None = typer.Option(
        None, "--output", "-o", help="Write JSON Schema to file (default: stdout)"
    ),
):
    """Print (or write) the JSON Schema for the profile file."""
    from src.generators.readme_generator import ReadmeData

    text = json.dumps(ReadmeData.model_json_schema(), indent=2, ensure_ascii=False)
    if output is None:
        typer.echo(text)
        raise typer.Exit(0)

    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(text, encoding="utf-8")


if __name__ == "__main__":
    app()
