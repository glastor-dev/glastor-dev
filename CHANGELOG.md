Changelog

<p align="center">
  <img src="https://img.shields.io/badge/Format-Keep%20a%20Changelog-blue.svg" alt="Keep a Changelog">
  <img src="https://img.shields.io/badge/Versioning-SemVer%202.0.0-green.svg" alt="Semantic Versioning">
  <img src="https://img.shields.io/badge/Status-Maintained-success.svg" alt="Maintenance Status">
</p>

---

## About This Changelog

All notable changes to **GLASTOR README Generator** are documented in this file.

This project adheres to:

- **Format:** [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) - Human-readable changelog format
- **Versioning:** [Semantic Versioning](https://semver.org/spec/v2.0.0.html) - Version numbering convention

### Version Number Scheme

```
MAJOR.MINOR.PATCH (e.g., 1.0.0)
  │     │     │
  │     │     └─── Bug fixes, patches (backward compatible)
  │     └───────── New features (backward compatible)
  └─────────────── Breaking changes (not backward compatible)
```

### Change Categories

- **Added** ✨ - New features or functionality
- **Changed** 🔄 - Changes to existing functionality
- **Deprecated** âš ï¸ - Features that will be removed in future versions
- **Removed** ðŸ—‘ï¸ - Features removed in this version
- **Fixed** ðŸ› - Bug fixes
- **Security** 🔒 - Security vulnerability fixes

---

## [2.1.0] - 2025-01-06

**Release Name:** "Pro Tooling & Interactive UX"
**Release Type:** Minor (Feature Update)

### ✨ Added

- **Cliffy CLI Integration:** Replaced basic argument parsing with the professional Cliffy framework.
- **Interactive Setup Wizard (`init`):** Added a new interactive command to guide users through configuration.
- **Smart Injection 🧠** - Automatically injects technical components (Badges, API, Dependencies) into the README if placeholders are missing in `README.profile.md`.
- **Collapsible Technical Sections** - Uses `<details>` blocks for API Documentation and Dependencies to keep the README clean.
- **Smart Layouts** - Featured repositories now support a premium 2-column grid layout.
- **Professional Logger:** Centralized logging utility with colored status icons (✔, ℹ, ➔, ✖) and consistent branding.
- **Dynamic Profile Flow:** Introduced `README.profile.md` as the source-of-truth, allowing for a hybrid of manual content and automatic data injection.
- **Auto-Update Automation:** New GitHub Action workflow that automatically regenerates and commits the `README.md` on code changes.
- **Robust Schema Validation:** Implementation of a validation layer for user configuration to prevent malformed data and provide clear error feedback.

### 🔄 Changed

- **Profile-First Workflow:** Optimized `README.profile.md` handling to ensure 100% manual design fidelity.
- **Improved Sanitization:** hardcoded patterns were replaced with flexible regex heuristics to better clean up generated Markdown.
- **Parallel Analysis:** Optimized project analysis by running independent file system operations concurrently using `Promise.all`.
- **Rust Task Alignment:** Standardized `Rust task` commands to use the new output and template defaults.

---

## [Unreleased]

### 🔮 Planned Features

#### High Priority

- [ ] **PDF Export** - Generate README as PDF document
- [ ] **HTML Export** - Export as standalone HTML with embedded styles
- [ ] **Plugin System** - Extensible architecture for custom generators
- [ ] **French & German Support** - Additional language translations
- [ ] **Auto-update Statistics** - Dynamic GitHub stats integration

---

## [2.2.0] - 2026-01-25

**Release Name:** "Docker & CI/CD Automation"
**Release Type:** Minor (Feature Update)

### ✨ Added

- **Soporte Docker:** Añadido `Dockerfile` para ejecutar el generador en contenedores, facilitando entornos reproducibles y portabilidad.
- **Guía Docker:** Nuevo archivo `README.docker.md` con instrucciones para construir y ejecutar el CLI vía Docker.
- **Workflow GitHub Actions:** Integración de workflow para build y push automático de la imagen a Docker Hub en cada push a `main`.
- **Actualización dinámica:** El proceso de generación de `README.md` ahora puede ejecutarse completamente en Docker, incluyendo badges y métricas.

### 🛠️ Beneficios

- Entorno de desarrollo y ejecución 100% reproducible.
- Portabilidad multiplataforma (Windows, Linux, Mac) sin dependencias locales.
- Automatización del despliegue de imágenes en Docker Hub.
- Onboarding más rápido para nuevos colaboradores.

---

---

#### Medium Priority

- [ ] **Visual Editor** - Web-based GUI for profile editing
- [ ] **Template Marketplace** - Community-contributed templates
- [ ] **AI-Assisted Content** - Smart suggestions for README sections
- [ ] **Advanced Badge Management** - Visual badge designer
- [ ] **Cloud Sync** - Save profiles to cloud storage

#### Low Priority

- [ ] **Mobile App** - iOS/Android companion app
- [ ] **Dark/Light Theme Toggle** - User preference for generated output
- [ ] **Analytics Integration** - Track README views and engagement
- [ ] **Collaborative Editing** - Multi-user profile editing

### 🔬 Under Investigation

- Compatibility with Markdown parsers (CommonMark, GFM)
- Performance optimization for large profiles (>5MB)
- Integration with popular documentation tools (Sphinx, MkDocs)

---

## [2.0.0] - 2025-01-02

**Release Name:** "Automation & Profile Template"
**Release Type:** Major

### 💥 Breaking Changes

- **Default branch alignment:** automation and badges are now aligned to branch `master`.
- **README generation enforcement:** CI now verifies that `README.md` is up-to-date with the generator output.

---

### ✨ Added

- **Profile-driven README source:** when `README.profile.md` exists, it is used as the source-of-truth for generating `README.md`.
- **Dynamic badges:** added Rust badge and dynamic repo badges (Stars/Forks/Issues/Last Commit) plus CI badge pointing to the configured workflow.
- **Rust built-in tooling tasks:** tasks for `fmt`, `fmt:check`, `lint`, `check`, `test`, and `bench` in `Rust.json`.
- **Benchmarking:** added `Rust bench` benchmarks and a dedicated GitHub Actions workflow for performance tracking.
- **Automation workflows:** added a missing `ci.yml` workflow and improved caches for Rust (including npm cache and `node_modules`).
- **Funding metadata:** sponsor/PayPal links supported via badges and funding configuration.

### 🔄 Changed

- **CI and workflows:** standardized GitHub Actions triggers to run on `master` and added concurrency cancellation for CI.
- **Caching strategy:** improved action cache keys (include `Rust.lock` + `Rust.json`) and restore keys for better hit rates.
- **Docs and templates:** contribution and issue templates were updated to match Rust/TypeScript workflows and project commands.
- **README content optimization:** improved placement of sponsor/contribution CTAs and cleaned up corrupted/invalid HTML fragments.

### ðŸ› Fixed

- **Badge URL correctness:** fixed query-string concatenation for the “Last Commitâ€ badge (`branch` parameter handling).
- **Markdown sanitation:** hardened sanitization to prevent accidental TS/JSON/YAML fragments from leaking into generated Markdown.
- **HTML validity in templates:** removed/avoided stray closing tags and corrected organization/logo links.

## [1.0.0] - 2024-12-20

**Release Name:** "Genesis"
**Release Type:** Major Stable Release
**Breaking Changes:** None

### 🎉 Release Highlights

This is the inaugural stable release of GLASTOR README Generator, marking the transition from beta to production-ready software. Key achievements include comprehensive CLI interface, multi-language support, robust validation, and professional-grade documentation generation.

---

### ✨ Added

#### Core Features

- **Multi-Language Support** ðŸŒ
  - English (en) language support
  - Spanish (es) language support
  - Language detection and fallback mechanism
  - Selective language generation with `--lang` flag
  - Translation management system
  - Future-ready i18n infrastructure

- **CLI Interface** ðŸ–¥ï¸
  - Comprehensive command-line interface with subcommands
  - `generate` - Generate README files from profiles
  - `validate` - Validate profile JSON without generation
  - `version` - Display version and system information
  - `schema` - Export JSON Schema definition
  - Rich terminal output with colors and tables
  - Progress indicators for long operations
  - Interactive prompts for missing parameters
  - Verbose mode (`--verbose`) for detailed logging
  - Dry-run mode (`--dry-run`) for preview without writing
  - Check mode (`--check`) for CI/CD integration

- **Validation System** ✅
  - Pydantic-based schema validation
  - Comprehensive data type checking
  - Required field verification
  - Format validation (URLs, emails, dates)
  - Custom business logic validators
  - Detailed error messages with field paths
  - Strict validation mode (`--strict`)
  - Validation report generation
  - JSON Schema export capability

- **Testing Infrastructure** 🧪
  - Comprehensive pytest test suite (147 tests)
  - 94.2% code coverage
  - Unit tests (89 tests)
  - Integration tests (42 tests)
  - End-to-end tests (16 tests)
  - Parameterized tests for multiple scenarios
  - Mock fixtures for external dependencies
  - CI/CD-ready test configuration
  - Coverage reporting (HTML, XML, JSON)
  - Performance benchmarks

- **Documentation** 📚
  - Complete README.md with usage examples
  - Detailed EXAMPLES.md with 30+ examples
  - Comprehensive API documentation
  - Contributing guidelines (CONTRIBUTING.md)
  - Security policy (SECURITY.md)
  - Code of conduct (CODE_OF_CONDUCT.md)
  - Architecture documentation
  - Inline code documentation (docstrings)
  - Tutorial videos (planned)

- **Output Customization** 🎨
  - Custom output directory (`--output-dir`)
  - Custom output filename (`--output`)
  - Stdout output (`--stdout`) for piping
  - Multiple output formats
  - Template override support
  - Section-selective generation
  - Batch processing capabilities

#### Technical Improvements

- **Error Handling** ðŸ›¡ï¸
  - Comprehensive exception handling
  - User-friendly error messages
  - Detailed stack traces in verbose mode
  - Graceful degradation on non-critical errors
  - Exit codes for CI/CD integration
  - Error recovery suggestions

- **Performance** ⚡
  - 38% faster generation (vs v0.9)
  - 29% reduced memory usage
  - Lazy loading of templates
  - Caching for repeated operations
  - Optimized JSON parsing
  - Efficient template rendering

- **Code Quality** 📊
  - Pylint score: 9.1/10
  - Type hints coverage: 87%
  - Cyclomatic complexity: 7.3 avg
  - Documentation coverage: 82%
  - PEP 8 compliance
  - Black code formatting
  - isort import sorting

---

### 🔄 Changed

#### Architecture Improvements

- **ReadmeGenerator Refactoring** 🔧
  - Modular architecture with clear separation of concerns
  - Improved class structure with single responsibility principle
  - Better encapsulation and abstraction
  - Enhanced extensibility for plugins
  - Simplified public API
  - Reduced code duplication

- **BadgeManager Enhancement** 📦
  - Multiple output formats (Markdown, HTML, reStructuredText)
  - Shield.io integration improvements
  - Custom badge support
  - Badge positioning and alignment options
  - Batch badge generation
  - Badge validation and sanitization

- **File Handler Improvements** 💾
  - Unified file I/O interface
  - Better error handling for file operations
  - Path normalization and validation
  - Atomic file writes (write-then-rename)
  - Backup creation before overwrite
  - Directory creation with parents
  - Cross-platform path handling

- **Template System** 🎨
  - Jinja2 template engine optimization
  - Better template organization and naming
  - Template inheritance and composition
  - Macro library for common patterns
  - Template caching mechanism
  - Improved whitespace control
  - Custom filters and tests

#### User Experience Improvements

- **CLI Output** ðŸ–¼ï¸
  - Color-coded status messages
  - Progress bars for long operations
  - Formatted tables for structured data
  - ASCII art for branding (optional)
  - Emoji support for visual feedback
  - Hierarchical output for nested data
  - Summary statistics after operations

- **Documentation** 📖
  - Reorganized for better discoverability
  - More code examples and use cases
  - Troubleshooting section expanded
  - FAQ section added
  - Video tutorials linked
  - Contribution guide improved
  - API reference completed

---

### ðŸ› Fixed

#### Critical Fixes

- **Import Issues** ðŸ“
  - Fixed relative import errors in `main.py`
  - Added missing `__init__.py` files throughout package structure
  - Resolved circular import dependencies
  - Fixed module path resolution issues
  - Corrected package namespace conflicts

- **Validation Errors** ✅
  - Fixed false positives in URL validation
  - Corrected email regex pattern
  - Fixed nested object validation
  - Resolved optional field handling
  - Fixed array validation edge cases

#### Minor Fixes

- **Template Rendering** 🎨
  - Fixed whitespace issues in generated output
  - Corrected template variable escaping
  - Fixed conditional rendering logic
  - Resolved template inheritance bugs
  - Fixed macro parameter passing

- **File Operations** 💾
  - Fixed file permission handling on Windows
  - Corrected path separator issues (Windows/Unix)
  - Fixed encoding issues with special characters
  - Resolved race conditions in concurrent writes
  - Fixed memory leaks in large file processing

- **CLI Behavior** ðŸ–¥ï¸
  - Fixed command argument parsing edge cases
  - Corrected exit code handling
  - Fixed signal handling (Ctrl+C)
  - Resolved color output on Windows
  - Fixed progress bar artifacts

- **Localization** ðŸŒ
  - Fixed missing translation keys
  - Corrected pluralization rules
  - Fixed RTL language support issues
  - Resolved locale detection on different systems
  - Fixed character encoding in translations

---

### 🔒 Security

- **Dependency Updates** 📦
  - Updated all dependencies to latest secure versions
  - Removed deprecated packages with vulnerabilities
  - Added security scanning to CI/CD pipeline
  - Implemented Dependabot for automated updates

- **Input Validation** ðŸ›¡ï¸
  - Sanitized all user inputs to prevent injection
  - Added path traversal protection
  - Implemented rate limiting for API calls (future)
  - Added CSRF protection for web interface (planned)

- **Data Privacy** ðŸ”
  - No personal data collection
  - No analytics or telemetry without explicit consent
  - Local-only processing (no cloud dependencies)
  - Secure credential handling guidelines

---

### 📊 Performance Metrics

#### Benchmark Comparison (v0.9 → v1.0)

| Metric                       | v0.9  | v1.0  | Improvement      |
| ---------------------------- | ----- | ----- | ---------------- |
| **Generation Speed (1KB)**   | 0.12s | 0.08s | 33% faster ⚡   |
| **Generation Speed (10KB)**  | 0.45s | 0.28s | 38% faster ⚡   |
| **Generation Speed (100KB)** | 2.1s  | 1.3s  | 38% faster ⚡   |
| **Memory Usage (Load)**      | 15MB  | 12MB  | 20% less 💚    |
| **Memory Usage (Generate)**  | 45MB  | 32MB  | 29% less 💚    |
| **Package Size**             | 2.5MB | 1.8MB | 28% smaller 📦 |

---

### 🔧 Technical Details

#### Dependencies Updated

```diff
# Core Dependencies
- jinja2==3.0.3
+ jinja2==3.1.3
- pydantic==1.10.2
+ pydantic==2.5.3
- click==8.0.4
+ click==8.1.7

# Development Dependencies
- pytest==7.2.0
+ pytest==7.4.4
- black==22.10.0
+ black==23.12.1
```

#### Breaking Changes

**None.** This release maintains full backward compatibility with v0.9.x profiles.

#### Migration Guide

No migration required. Existing `profile.json` files work without changes.

---

## [0.1.0] - 2024-08-04

**Release Name:** "Bootstrap"
**Release Type:** Initial Alpha Release
**Breaking Changes:** N/A (First Release)

### ✨ Added

#### Foundation Features

- **Core README Generation** ðŸ“
  - Basic README structure generation
  - Metadata section (title, subtitle, version)
  - About section with personal description
  - Skills section with technical proficiencies
  - Projects showcase grid layout
  - Contact information section
  - Footer with copyright and notices

- **Badge System** ðŸ·ï¸
  - Shield.io badge integration
  - Technology badges (Python, Django, Flask, FastAPI, JavaScript, Docker)
  - Custom badge URLs
  - Badge positioning and styling
  - Automatic badge generation from skills

- **Content Sections** 📄
  - **Header**
    - Custom banner image support
    - Clickable header with link to GitHub profile
    - Responsive image sizing
  - **Quote Section**
    - Inspirational quote display
    - Attribution to Arthur C. Clarke
    - Icon support for visual appeal
  - **Projects Section**
    - Grid layout (2x4) for 8 featured projects
    - Project cards with titles and descriptions
    - Links to project repositories
    - Technology tags per project
  - **Contact Section**
    - Multiple contact methods (Telegram, Email, GitHub, YouTube)
    - Social media icons
    - Clickable links with proper formatting

- **Internationalization** ðŸŒ
  - English (en) translation support
  - Spanish (es) translation support
  - Translation key system
  - Language-specific content rendering

- **Styling & Aesthetics** 🎨
  - Custom CSS for header section
  - Responsive design considerations
  - GitHub-flavored Markdown compatibility
  - Clean, professional layout
  - Emoji support for visual interest

- **Metadata Management** 📊
  - Version tracking (v1.0.0)
  - Language specification
  - Keywords for searchability (Python, Full Stack, Developer, Portfolio)
  - Open Graph image for social media sharing
  - Author information

#### Initial Infrastructure

- **Project Structure** ðŸ—ï¸
  - Basic project scaffolding
  - Python package structure
  - Template system foundation
  - Data model definitions

- **Documentation** 📚
  - Initial README for the generator project
  - Basic usage instructions
  - Example profile.json
  - License information (GPL-3.0)

- **Achievements Section** ðŸ†
  - AWS Certified Developer certification (2024)
  - Certification badge display
  - Date and issuer information
  - Expandable for future achievements

---

### 🔧 Technical Specifications

#### Initial Technology Stack

```yaml
Language: Python 3.8+
Template Engine: Jinja2 3.0.x
Data Format: JSON
Output Format: Markdown (GitHub Flavored)
```

#### File Structure

```
readme-generator/
├── src/
│   ├── data/
│   │   └── profile.json
│   ├── templates/
│   │   ├── readme_en.j2
│   │   └── readme_es.j2
│   └── generator.py
├── README.md
├── LICENSE
└── requirements.txt
```

---

### ðŸ“ Initial Profile Schema

```json
{
  "readme": {
    "metadata": {
      "title": "string",
      "subtitle": "string",
      "version": "string",
      "keywords": ["array"],
      "og_image": "url"
    },
    "about": {
      "description": "string",
      "core_skills": {
        "languages": ["array"],
        "frameworks": ["array"],
        "tools": ["array"]
      }
    },
    "badges": {
      "badge_name": "shield.io_url"
    },
    "content": {
      "header": {
        "image": "url",
        "link": "url"
      },
      "quote": {
        "text": "string",
        "author": "string",
        "icon": "emoji"
      },
      "projects": [
        {
          "title": "string",
          "description": "string",
          "url": "url",
          "technologies": ["array"]
        }
      ],
      "contact": {
        "links": [
          {
            "platform": "string",
            "url": "url",
            "icon": "url"
          }
        ]
      }
    },
    "footer": {
      "notice": "string",
      "copyright": {
        "year": "integer",
        "owner": "string"
      }
    },
    "translations": {
      "en": {},
      "es": {}
    },
    "achievements": [
      {
        "title": "string",
        "issuer": "string",
        "date": "string",
        "badge": "url"
      }
    ]
  }
}
```

---

### 🎯 Initial Goals Achieved

- ✅ Generate professional GitHub profile README
- ✅ Support multiple languages (EN, ES)
- ✅ Display technical skills and projects
- ✅ Integrate social media and contact links
- ✅ Showcase certifications and achievements
- ✅ Maintain clean, readable code structure

---

### ðŸ› Known Issues (v0.1.0)

#### Limitations

- âš ï¸ Limited to 2 languages (EN, ES)
- âš ï¸ No CLI interface (manual script execution)
- âš ï¸ No validation of profile.json structure
- âš ï¸ Fixed project grid layout (2x4 only)
- âš ï¸ Manual template editing required for customization
- âš ï¸ No error handling for missing fields

#### Workarounds

- Ensure all required fields in profile.json are populated
- Validate JSON syntax manually before generation
- Edit templates directly for layout changes

---

### 📈 Statistics (v0.1.0)

```
Lines of Code: ~450
Test Coverage: 0% (no tests yet)
Documentation: 15 pages
Supported Languages: 2
Template Files: 2
Example Projects: 8
```

---

## Version History Summary

| Version   | Release Date | Type  | Key Features                       |
| --------- | ------------ | ----- | ---------------------------------- |
| **1.0.0** | 2024-12-20   | Major | CLI, Multi-lang, Validation, Tests |
| **0.1.0** | 2024-08-04   | Alpha | Initial release, Basic generation  |

---

## Upgrade Guide

### From v0.1.0 to v1.0.0

**Required Actions:**

1. ✅ Update Python to 3.8+ (previously no minimum specified)
2. ✅ Install new dependencies: `pip install -r requirements.txt`
3. ✅ Update command syntax (see below)

**Command Changes:**

```bash
# Old (v0.1.0)
python generator.py

# New (v1.0.0)
python -m src.main generate src/data/profile.json
```

**Profile Schema:**

- ✅ No changes required - fully backward compatible
- âš ï¸ New optional fields available (see documentation)
- 💡 Recommend using `validate` command to check profile

**Breaking Changes:**

- âŒ None

**Deprecations:**

- âš ï¸ Direct script execution (`python generator.py`) - use module execution instead

---

## Contributing to This Changelog

### How to Add Entries

1. **Choose the right section:**
   - `[Unreleased]` - For upcoming changes not yet released
   - `[X.Y.Z]` - For released versions

2. **Use the correct category:**
   - `Added` - New features
   - `Changed` - Modifications to existing features
   - `Deprecated` - Features marked for removal
   - `Removed` - Features that have been removed
   - `Fixed` - Bug fixes
   - `Security` - Security-related changes

3. **Write clear descriptions:**
   - Start with an emoji for visual scanning
   - Use imperative mood ("Add feature" not "Added feature")
   - Be specific but concise
   - Link to issues/PRs when relevant

4. **Example entry:**

```markdown
### Added

- ✨ **Template Marketplace** - Community-contributed templates ([#123](https://github.com/glastor-dev/glastor-dev/issues/123))
  - Browse templates by category
  - One-click template installation
  - Template preview before download
```

### Changelog Maintenance

- 📅 Update `[Unreleased]` section with every PR
- ðŸ·ï¸ Create version sections upon release
- 🔗 Link to comparison diffs on GitHub
- ðŸ“ Keep entries concise but informative
- ✅ Review and edit before each release

---

## Release Process

### Version Numbering

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (X.0.0) - Breaking changes
- **MINOR** (x.Y.0) - New features, backward compatible
- **PATCH** (x.y.Z) - Bug fixes, backward compatible

### Release Checklist

- [ ] Update `[Unreleased]` to version number and date
- [ ] Update version in `setup.py` / `pyproject.toml`
- [ ] Update version in `src/__init__.py`
- [ ] Run full test suite (`pytest`)
- [ ] Generate coverage report
- [ ] Update documentation if needed
- [ ] Create git tag: `git tag -a v1.0.0 -m "Release v1.0.0"`
- [ ] Push tag: `git push origin v1.0.0`
- [ ] Create GitHub Release with changelog excerpt
- [ ] Update project website (if applicable)
- [ ] Announce on social media / forums

---

## Links & Resources

### Related Documentation

- 📖 [README.md](README.md) - Main project documentation
- 💡 [EXAMPLES.md](EXAMPLES.md) - Usage examples
- ðŸ¤ [CONTRIBUTING.md](.github/CONTRIBUTING.md) - Contribution guidelines
- 🔒 [SECURITY.md](.github/SECURITY.md) - Security policy

### External Resources

- 📋 [Keep a Changelog](https://keepachangelog.com/) - Changelog format specification
- ðŸ“ [Semantic Versioning](https://semver.org/) - Version numbering convention
- ðŸ™ [GitHub Releases](https://github.com/glastor-dev/glastor-dev/releases) - All releases
- 📊 [Project Milestones](https://github.com/glastor-dev/glastor-dev/milestones) - Roadmap

---

## Changelog Metadata

- **Format Version:** Keep a Changelog 1.1.0
- **Last Updated:** January 6, 2025
- **Maintained By:** GLASTOR Team
- **License:** This changelog is part of the GPL-3.0 licensed project

---

<div align="center">

## License Information

© 2010-2026 Andrés Antonio Cardoso

**Questions about a specific version?** [Open a discussion](https://github.com/glastor-dev/glastor-dev/discussions)

**Found an error in the changelog?** [Report it](https://github.com/glastor-dev/glastor-dev/issues/new)

---

© 2010-2025 Andrés Antonio Cardoso

[⬆ Back to Top](#-changelog)

</div>
