#!/usr/bin/env python
"""
Interactive Copyright Generator Demo
Run this script to see the copyright generator in action!
"""

from datetime import datetime

from rich.console import Console
from rich.panel import Panel
from rich.table import Table

from src.utils.copyright_generator import CopyrightGenerator, get_copyright

console = Console()


def demo_basic():
    """Demo basic functionality"""
    console.print("\n[bold cyan]1. FUNCIÓN RÁPIDA[/bold cyan]")
    console.print("─" * 60)

    result = get_copyright()
    console.print("[green]get_copyright()[/green]")
    console.print(f"  → {result}\n")

    result = get_copyright(owner="Tu Nombre", start_year=2015)
    console.print("[green]get_copyright(owner='Tu Nombre', start_year=2015)[/green]")
    console.print(f"  → {result}\n")


def demo_formats():
    """Demo all formats"""
    console.print("\n[bold cyan]2. TODOS LOS FORMATOS[/bold cyan]")
    console.print("─" * 60)

    generator = CopyrightGenerator("Andrés Antonio Cardoso", 2010)

    formats = ["full", "short", "range", "symbol", "html", "markdown"]

    table = Table(
        title="Formatos Disponibles", show_header=True, header_style="bold magenta"
    )
    table.add_column("Formato", style="cyan", width=12)
    table.add_column("Resultado", style="green")

    for fmt in formats:
        result = generator.generate(fmt)
        table.add_row(fmt, result)

    console.print(table)
    console.print()


def demo_methods():
    """Demo different methods"""
    console.print("\n[bold cyan]3. MÉTODOS ESPECIALES[/bold cyan]")
    console.print("─" * 60)

    generator = CopyrightGenerator("Andrés Antonio Cardoso", 2010)

    console.print("[yellow]Footer sin licencia:[/yellow]")
    console.print(f"  {generator.generate_footer()}\n")

    console.print("[yellow]Footer con licencia:[/yellow]")
    console.print(f"  {generator.generate_footer(include_license=True)}\n")

    console.print("[yellow]Header sin proyecto:[/yellow]")
    console.print(f"  {generator.generate_header()}\n")

    console.print("[yellow]Header con proyecto:[/yellow]")
    console.print(f"  {generator.generate_header('README Generator')}\n")


def demo_year_range():
    """Demo year range behavior"""
    console.print("\n[bold cyan]4. RANGO DE AÑOS DINÁMICO[/bold cyan]")
    console.print("─" * 60)

    current_year = datetime.now().year

    # Different years
    gen1 = CopyrightGenerator("Usuario", 2010)
    console.print(f"[yellow]Inicio: 2010, Actual: {current_year}[/yellow]")
    console.print(f"  → {gen1.generate('range')}\n")

    # Same year
    gen2 = CopyrightGenerator("Usuario", current_year)
    console.print(f"[yellow]Inicio: {current_year}, Actual: {current_year}[/yellow]")
    console.print(f"  → {gen2.generate('range')}\n")

    # Future proof
    console.print("[yellow]🔮 Actualización Automática:[/yellow]")
    console.print("  En 2026 mostrará: 2010-2026")
    console.print("  En 2030 mostrará: 2010-2030")
    console.print("  [dim]¡Sin cambios de código necesarios![/dim]\n")


def demo_use_cases():
    """Demo practical use cases"""
    console.print("\n[bold cyan]5. CASOS DE USO PRÁCTICOS[/bold cyan]")
    console.print("─" * 60)

    generator = CopyrightGenerator("Andrés Antonio Cardoso", 2010)

    # README footer
    console.print("[yellow]📄 README Footer:[/yellow]")
    readme_footer = f"---\n\n{generator.generate('short')}"
    console.print(Panel(readme_footer, border_style="blue"))

    # Code header
    console.print("\n[yellow]💻 Code Header:[/yellow]")
    code_header = f"""# {generator.generate('full')}
# Licensed under GPL-3.0
#
# This file is part of README Generator"""
    console.print(Panel(code_header, border_style="green"))

    # HTML footer
    console.print("\n[yellow]🌐 HTML Footer:[/yellow]")
    html_footer = f'<footer>\n  <p>{generator.generate("html")}</p>\n</footer>'
    console.print(Panel(html_footer, border_style="magenta"))


def main():
    """Run all demos"""
    console.clear()

    console.print(
        Panel.fit(
            "[bold white]COPYRIGHT GENERATOR - DEMO INTERACTIVA[/bold white]\n"
            "[dim]Generador automático de copyright 2010-2025[/dim]",
            border_style="green",
        )
    )

    demo_basic()
    demo_formats()
    demo_methods()
    demo_year_range()
    demo_use_cases()

    # Summary
    console.print("\n[bold green]✨ RESUMEN[/bold green]")
    console.print("─" * 60)
    console.print("✅ 6 formatos diferentes")
    console.print("✅ Actualización automática del año")
    console.print("✅ Fácil integración")
    console.print("✅ Sin dependencias externas")
    console.print("✅ 14 tests unitarios\n")

    console.print("[bold cyan]📚 Más información:[/bold cyan]")
    console.print("  → code COPYRIGHT_GENERATOR.md")
    console.print("  → pytest tests/test_copyright_generator.py -v\n")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        console.print("\n[yellow]Demo interrumpida[/yellow]")
    except Exception as e:
        console.print(f"\n[red]Error: {e}[/red]")
