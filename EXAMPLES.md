# 💡 Usage Examples & Tutorials

<p align="center">
  <img src="https://img.shields.io/badge/Examples-30+-blue.svg" alt="Examples">
  <img src="https://img.shields.io/badge/Difficulty-Beginner%20to%20Advanced-green.svg" alt="Difficulty">
  <img src="https://img.shields.io/badge/Updated-December%202025-brightgreen.svg" alt="Updated">
</p>

---

## 📋 Table of Contents

- [Quick Start Examples](#-quick-start-examples)
- [Basic Usage](#-basic-usage)
- [Language-Specific Generation](#-language-specific-generation)
- [Output Customization](#-output-customization)
- [Validation & Quality Assurance](#-validation--quality-assurance)
- [Advanced Features](#-advanced-features)
- [CI/CD Integration](#-cicd-integration)
- [Custom Profile Templates](#-custom-profile-templates)
- [Batch Processing](#-batch-processing)
- [Troubleshooting Examples](#-troubleshooting-examples)
- [Pro Tips & Best Practices](#-pro-tips--best-practices)

---

## 🚀 Quick Start Examples

### Example 1: Generate Your First README

The simplest way to create a README from your profile:
```bash
# Generate README.md using default settings
python -m src.main generate src/data/profile.json
```

**What happens:**
- ✅ Reads `profile.json`
- ✅ Generates `README.md` in current directory
- ✅ Uses default language from profile
- ✅ Applies configured template

**Expected Output:**
```
📂 Data file: src/data/profile.json
📁 Output directory: .
✓ Loaded data from profile.json
✓ Found 6 badges
✓ README.md: 2189 chars, 31 lines
✨ Generation complete!
```

---

### Example 2: Validate Before Generating

Always validate your profile before generation:
```bash
# Step 1: Validate profile structure
python -m src.main validate src/data/profile.json

# Step 2: Generate if validation passes
python -m src.main generate src/data/profile.json
```

**Why validate first?**
- 🔍 Catches errors before generation
- ⚡ Saves time on invalid configurations
- 📊 Provides detailed error messages
- ✅ Ensures output quality

---

### Example 3: Generate All Language Variants

Create README files in all supported languages:
```bash
# Generate README.md + README_EN.md + README_ES.md
python -m src.main generate src/data/profile.json --lang all
```

**Output Files:**
- `README.md` - Default language (from profile)
- `README_EN.md` - English version
- `README_ES.md` - Spanish version

---

## 📚 Basic Usage

### Generate Single README

#### Default Generation
```bash
# Uses language configured in profile.json
python -m src.main generate src/data/profile.json
```

**Use Case:** Standard single-language project

---

#### With Verbose Output
```bash
# See detailed generation steps
python -m src.main generate src/data/profile.json --verbose
```

**Verbose Output Example:**
```
📂 Data file: src/data/profile.json
📁 Output directory: .
🔍 Loading profile data...
✓ Loaded data from profile.json
🔍 Processing badges...
✓ Found 6 badges
🔍 Rendering template...
✓ Template rendered successfully
🔍 Writing output file...
✓ README.md: 2189 chars, 31 lines
⏱️  Generation time: 0.234s
✨ Generation complete!
```

**Use Case:** Debugging, learning, CI/CD logging

---

### Generate Multiple READMEs

#### All Language Variants
```bash
# Generate all supported languages
python -m src.main generate src/data/profile.json --lang all
```

**Result:**

| File | Language | Status |
|------|----------|--------|
| `README.md` | Default | ✅ Generated |
| `README_EN.md` | English | ✅ Generated |
| `README_ES.md` | Spanish | ✅ Generated |

---

#### Specific Languages Only
```bash
# Generate only English and Spanish (skip default)
python -m src.main generate src/data/profile.json --lang en,es
```

**Use Case:** Multi-language projects, international audiences

---

## 🌍 Language-Specific Generation

### English Version
```bash
# Generate README.md in English
python -m src.main generate src/data/profile.json --lang en
```

**Output:** `README.md` (English content)

**Use Case:**
- International open-source projects
- Global company documentation
- English-first projects

---

### Spanish Version
```bash
# Generate README.md in Spanish
python -m src.main generate src/data/profile.json --lang es
```

**Output:** `README.md` (Spanish content)

**Use Case:**
- Spanish-speaking audiences
- Latin American projects
- Bilingual documentation

---

### Custom Language Suffix
```bash
# Generate with custom filename
python -m src.main generate src/data/profile.json --lang en --output README_ENGLISH.md
```

**Output:** `README_ENGLISH.md`

**Use Case:** Custom naming conventions, multi-variant documentation

---

### Language Comparison

Generate both versions for comparison:
```bash
# Generate both English and Spanish
python -m src.main generate src/data/profile.json --lang en --output README_EN.md
python -m src.main generate src/data/profile.json --lang es --output README_ES.md

# View side-by-side
diff README_EN.md README_ES.md
```

**Use Case:** Translation verification, content consistency checks

---

## 📁 Output Customization

### Custom Output Directory

#### Create in Docs Folder
```bash
# Generate in docs/ directory
python -m src.main generate src/data/profile.json --output-dir ./docs
```

**Result:** Creates `docs/README.md`

**Use Case:**
- Separate documentation directory
- GitHub Pages setup
- Multi-directory projects

---

#### Create in Multiple Directories
```bash
# Generate in different locations
python -m src.main generate src/data/profile.json --output-dir ./docs
python -m src.main generate src/data/profile.json --output-dir ./website/content
python -m src.main generate src/data/profile.json --output-dir ./publish
```

**Use Case:** Deploy to multiple platforms (GitHub, website, CDN)

---

### Custom Output File

#### Specific Filename
```bash
# Custom filename
python -m src.main generate src/data/profile.json --output ./PROJECT_README.md
```

**Output:** `PROJECT_README.md`

---

#### Timestamped Output
```bash
# Generate with timestamp in filename
python -m src.main generate src/data/profile.json --output "README_$(date +%Y%m%d).md"
```

**Output:** `README_20251229.md`

**Use Case:** Version history, backup documentation

---

### Print to Standard Output

#### Redirect to File
```bash
# Print to stdout and redirect
python -m src.main generate src/data/profile.json --stdout > README.md
```

**Use Case:** Piping to other tools, custom processing

---

#### Pipe to Other Commands
```bash
# Count lines
python -m src.main generate src/data/profile.json --stdout | wc -l

# Search for keywords
python -m src.main generate src/data/profile.json --stdout | grep "Python"

# Upload to service
python -m src.main generate src/data/profile.json --stdout | curl -X POST -d @- https://api.example.com
```

**Use Case:** Integration with other tools, data processing pipelines

---

## ✅ Validation & Quality Assurance

### Basic Validation

#### Validate Profile Structure
```bash
# Validate JSON structure
python -m src.main validate src/data/profile.json
```

**Success Output:**
```
🔍 Validating: src/data/profile.json
✅ JSON data is valid!
✓ Schema validation passed
✓ All required fields present
✓ Data types correct
```

**Error Output:**
```
🔍 Validating: src/data/profile.json
❌ Validation failed: metadata must contain 'title'

Errors found:
  • Missing required field: metadata.title
  • Invalid type for 'year': expected int, got string
  • URL format invalid: badges.Python
```

---

### Strict Validation

#### Enforce Strict Schema
```bash
# Fail on unknown fields
python -m src.main validate src/data/profile.json --strict
```

**What Strict Mode Checks:**
- ❌ Unknown/extra fields not in schema
- ❌ Deprecated field usage
- ❌ Non-standard field names
- ❌ Invalid enum values

**Example Strict Failure:**
```
❌ Strict validation failed!

Unknown fields detected:
  • readme.extra_field (not in schema)
  • readme.metadata.custom_property (not allowed)

Remove these fields or use --no-strict to ignore.
```

**Use Case:**
- Production deployments
- Automated CI checks
- Enforcing schema compliance

---

### Validation Reports

#### Generate Validation Report
```bash
# Create detailed validation report
python -m src.main validate src/data/profile.json --report validation-report.json
```

**Report Contents:**
```json
{
  "status": "valid",
  "profile": "src/data/profile.json",
  "timestamp": "2025-12-29T10:30:00Z",
  "checks": {
    "schema_valid": true,
    "required_fields": true,
    "type_checking": true,
    "format_validation": true
  },
  "warnings": [],
  "errors": [],
  "statistics": {
    "total_fields": 47,
    "badges_count": 6,
    "links_count": 12
  }
}
```

**Use Case:** Audit trails, compliance reporting, quality metrics

---

### JSON Schema Export

#### View Schema
```bash
# Print schema to console
python -m src.main schema
```

**Output:** JSON Schema definition

---

#### Export Schema to File
```bash
# Save schema for documentation
python -m src.main schema --output ./profile.schema.json
```

**Use Case:**
- IDE autocomplete
- Documentation generation
- Schema versioning
- Integration with validators

---

## 🚀 Advanced Features

### Check Mode (CI/CD)

#### Verify README is Up-to-Date
```bash
# Exit code 0 if up-to-date, 1 if outdated
python -m src.main generate src/data/profile.json --check
```

**Output (Up-to-date):**
```
✓ README.md is up-to-date
✓ README_EN.md is up-to-date
✓ README_ES.md is up-to-date
Exit code: 0
```

**Output (Outdated):**
```
⚠️  README.md is outdated (profile modified)
⚠️  README_EN.md is outdated (profile modified)
Exit code: 1
```

**Use Case:**
- CI/CD pipelines
- Pre-commit hooks
- Automated quality checks

---

### Dry Run Mode

#### Preview Without Writing
```bash
# Show what would be generated without saving
python -m src.main generate src/data/profile.json --dry-run
```

**Output:**
```
🔍 DRY RUN MODE - No files will be written

Would generate:
  → README.md (2189 chars, 31 lines)
  → README_EN.md (1919 chars, 23 lines)
  → README_ES.md (1935 chars, 22 lines)

Preview (first 10 lines of README.md):
────────────────────────────────────────
# 👨‍💻 Andrés Antonio Cardoso

[![Python](https://img.shields.io/badge/Python...)]
...
────────────────────────────────────────

No files were written.
```

**Use Case:** Testing configurations, previewing changes

---

### Template Override

#### Use Custom Template
```bash
# Specify custom Jinja2 template
python -m src.main generate src/data/profile.json --template ./my-templates/custom.j2
```

**Custom Template Example (`custom.j2`):**
```jinja2
# {{ metadata.title }}

> {{ about.description }}

## 🛠️ Tech Stack

{% for lang in about.core_skills.languages %}
- {{ lang }}
{% endfor %}

---

© {{ footer.copyright.year }} {{ footer.copyright.owner }}
```

**Use Case:** Brand-specific formatting, custom layouts

---

### Diff Mode

#### Show Changes
```bash
# Show diff between existing and new README
python -m src.main generate src/data/profile.json --diff
```

**Output:**
```
Comparing README.md with generated content...

--- README.md (existing)
+++ README.md (generated)
@@ -5,7 +5,7 @@

-Full Stack Developer | Data Scientist
+Full Stack Developer | AI Engineer | Data Scientist

@@ -15,3 +15,5 @@
+
+## 🎓 New Certification
+AWS Certified Solutions Architect
```

**Use Case:** Review changes before committing, change tracking

---

## 🔄 CI/CD Integration

### GitHub Actions

#### Workflow Example
```yaml
# .github/workflows/update-readme.yml
name: Update README

on:
  push:
    paths:
      - 'src/data/profile.json'
    branches:
      - main

jobs:
  update-readme:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'

      - name: Install dependencies
        run: |
          pip install -r requirements.txt

      - name: Validate profile
        run: |
          python -m src.main validate src/data/profile.json --strict

      - name: Generate README
        run: |
          python -m src.main generate src/data/profile.json --lang all --verbose

      - name: Commit changes
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add README*.md
          git commit -m "🤖 Auto-update README files" || exit 0
          git push
```

**Triggers:** Automatically updates README when `profile.json` changes

---

### GitLab CI

#### Pipeline Example
```yaml
# .gitlab-ci.yml
stages:
  - validate
  - generate
  - deploy

validate-profile:
  stage: validate
  script:
    - pip install -r requirements.txt
    - python -m src.main validate src/data/profile.json --strict
  only:
    changes:
      - src/data/profile.json

generate-readme:
  stage: generate
  script:
    - pip install -r requirements.txt
    - python -m src.main generate src/data/profile.json --lang all
  artifacts:
    paths:
      - README*.md
    expire_in: 1 week
  only:
    changes:
      - src/data/profile.json

deploy-docs:
  stage: deploy
  script:
    - cp README*.md /path/to/docs/
  only:
    - main
```

---

### Pre-commit Hook

#### Git Hook Setup
```bash
# .git/hooks/pre-commit
#!/bin/bash

echo "🔍 Validating profile.json..."
python -m src.main validate src/data/profile.json --strict

if [ $? -ne 0 ]; then
    echo "❌ Validation failed! Fix errors before committing."
    exit 1
fi

echo "📝 Checking if README is up-to-date..."
python -m src.main generate src/data/profile.json --check

if [ $? -ne 0 ]; then
    echo "⚠️  README is outdated. Regenerating..."
    python -m src.main generate src/data/profile.json --lang all
    git add README*.md
    echo "✅ README updated and staged"
fi

exit 0
```

**Make executable:**
```bash
chmod +x .git/hooks/pre-commit
```

**Use Case:** Enforce README updates before commits

---

### Jenkins Pipeline

#### Jenkinsfile Example
```groovy
pipeline {
    agent any

    stages {
        stage('Validate') {
            steps {
                sh 'python -m src.main validate src/data/profile.json --strict'
            }
        }

        stage('Generate') {
            steps {
                sh 'python -m src.main generate src/data/profile.json --lang all --verbose'
            }
        }

        stage('Archive') {
            steps {
                archiveArtifacts artifacts: 'README*.md', fingerprint: true
            }
        }
    }

    post {
        failure {
            mail to: 'dev-team@example.com',
                 subject: "Failed Pipeline: ${currentBuild.fullDisplayName}",
                 body: "README generation failed. Check console output."
        }
    }
}
```

---

## 📋 Custom Profile Templates

### Minimal Profile

**Use Case:** Personal GitHub profile, simple projects
```json
{
  "readme": {
    "metadata": {
      "title": "John Doe",
      "subtitle": "Software Developer",
      "emoji": "👨‍💻"
    },
    "about": {
      "description": "Passionate about clean code and open source."
    },
    "contact": {
      "links": [
        {
          "platform": "GitHub",
          "url": "https://github.com/johndoe",
          "icon": "fab fa-github"
        },
        {
          "platform": "Email",
          "url": "mailto:john@example.com",
          "icon": "fas fa-envelope"
        }
      ]
    },
    "footer": {
      "copyright": {
        "year": 2025,
        "owner": "John Doe"
      }
    }
  }
}
```

**Generate:**
```bash
python -m src.main generate minimal-profile.json
```

---

### Professional Profile

**Use Case:** Corporate projects, enterprise documentation
```json
{
  "readme": {
    "metadata": {
      "title": "Acme Corporation Engineering",
      "subtitle": "Building the future of technology",
      "emoji": "🏢",
      "version": "2.0.0",
      "logo": "https://acme.com/logo.png"
    },
    "about": {
      "description": "Leading provider of enterprise software solutions.",
      "mission": "Empowering businesses through innovative technology.",
      "core_skills": {
        "languages": ["Java", "Python", "Go", "TypeScript"],
        "frameworks": ["Spring Boot", "React", "Kubernetes"],
        "tools": ["Jenkins", "Docker", "Terraform"]
      }
    },
    "badges": {
      "Build": "https://img.shields.io/github/workflow/status/acme/project/CI",
      "Coverage": "https://img.shields.io/codecov/c/github/acme/project",
      "License": "https://img.shields.io/badge/license-Apache%202.0-blue"
    },
    "content": {
      "sections": {
        "architecture": {
          "title": "Architecture",
          "content": "Microservices-based architecture..."
        },
        "security": {
          "title": "Security",
          "content": "SOC 2 Type II certified..."
        }
      }
    },
    "footer": {
      "notice": "Confidential - Internal Use Only",
      "copyright": {
        "year": 2025,
        "owner": "Acme Corporation"
      },
      "legal": "All trademarks are property of their respective owners."
    }
  }
}
```

---

### Open Source Project Profile

**Use Case:** GitHub open-source projects, community projects
```json
{
  "readme": {
    "metadata": {
      "title": "Awesome CLI Tool",
      "subtitle": "A blazing fast CLI for developers",
      "emoji": "⚡",
      "version": "3.2.1"
    },
    "badges": {
      "npm": "https://img.shields.io/npm/v/awesome-cli",
      "downloads": "https://img.shields.io/npm/dm/awesome-cli",
      "license": "https://img.shields.io/badge/license-MIT-blue",
      "contributors": "https://img.shields.io/github/contributors/org/awesome-cli",
      "stars": "https://img.shields.io/github/stars/org/awesome-cli?style=social"
    },
    "about": {
      "description": "Supercharge your development workflow with this powerful CLI tool.",
      "features": [
        "🚀 Lightning fast performance",
        "🎨 Beautiful terminal output",
        "🔧 Highly configurable",
        "📦 Zero dependencies",
        "🌍 Cross-platform support"
      ]
    },
    "content": {
      "installation": {
        "npm": "npm install -g awesome-cli",
        "yarn": "yarn global add awesome-cli",
        "brew": "brew install awesome-cli"
      },
      "usage": {
        "basic": "awesome-cli init",
        "advanced": "awesome-cli deploy --env production"
      }
    },
    "contributing": {
      "enabled": true,
      "guidelines": "See CONTRIBUTING.md"
    },
    "footer": {
      "notice": "Made with ❤️ by the community",
      "copyright": {
        "year": 2025,
        "owner": "Awesome CLI Contributors"
      }
    }
  }
}
```

---

## 🔄 Batch Processing

### Process Multiple Profiles

#### Basic Batch Processing
```bash
# Generate READMEs for all profiles in a directory
for profile in profiles/*.json; do
    echo "Processing $profile..."
    python -m src.main generate "$profile" --output-dir ./output
done
```

**Use Case:** Multiple projects, monorepo setups

---

#### Parallel Batch Processing
```bash
# Process profiles in parallel (requires GNU Parallel)
find profiles/ -name "*.json" | parallel -j 4 \
    python -m src.main generate {} --output-dir ./output --verbose
```

**Use Case:** Large-scale generation, CI/CD optimization

---

### Automated Profile Updates

#### Update Script Example
```bash
#!/bin/bash
# update-all-readmes.sh

PROFILES_DIR="./profiles"
OUTPUT_DIR="./generated"

echo "🔄 Batch README Generation"
echo "=========================="

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Counter for statistics
total=0
success=0
failed=0

# Process each profile
for profile in "$PROFILES_DIR"/*.json; do
    total=$((total + 1))
    filename=$(basename "$profile" .json)

    echo "📝 Processing: $filename"

    # Validate first
    if python -m src.main validate "$profile" --strict; then
        # Generate if validation passes
        if python -m src.main generate "$profile" \
            --output-dir "$OUTPUT_DIR/$filename" \
            --lang all; then
            success=$((success + 1))
            echo "✅ $filename: Success"
        else
            failed=$((failed + 1))
            echo "❌ $filename: Generation failed"
        fi
    else
        failed=$((failed + 1))
        echo "❌ $filename: Validation failed"
    fi

    echo ""
done

# Print summary
echo "=========================="
echo "📊 Summary"
echo "Total:   $total"
echo "Success: $success"
echo "Failed:  $failed"
echo "=========================="
```

**Make executable and run:**
```bash
chmod +x update-all-readmes.sh
./update-all-readmes.sh
```

---

## 🔧 Troubleshooting Examples

### Common Issues & Solutions

#### Issue 1: File Not Found

**Error:**
```bash
$ python -m src.main generate nonexistent.json
❌ Error: File 'nonexistent.json' not found
```

**Solution:**
```bash
# Check file exists
ls -la nonexistent.json

# Use absolute path
python -m src.main generate /absolute/path/to/profile.json

# Check current directory
python -m src.main generate ./src/data/profile.json
```

---

#### Issue 2: Invalid Language Code

**Error:**
```bash
$ python -m src.main generate profile.json --lang fr
❌ Error: Invalid language 'fr'. Supported: 'en', 'es', 'all'
```

**Solution:**
```bash
# Use supported language
python -m src.main generate profile.json --lang en

# Or generate all languages
python -m src.main generate profile.json --lang all
```

---

#### Issue 3: JSON Syntax Error

**Error:**
```bash
$ python -m src.main validate profile.json
❌ Validation failed: Invalid JSON format
Expecting ',' delimiter: line 5 column 3 (char 89)
```

**Solution:**
```bash
# Validate JSON syntax with jq
jq empty profile.json

# Or use Python
python -c "import json; json.load(open('profile.json'))"

# Fix common issues
# - Missing commas
# - Trailing commas
# - Unquoted strings
# - Unclosed brackets
```

---

#### Issue 4: Missing Required Field

**Error:**
```bash
$ python -m src.main validate profile.json
❌ Validation failed: metadata must contain 'title'
```

**Solution:**
```json
{
  "readme": {
    "metadata": {
      "title": "Your Title Here",  // ← Add missing field
      "subtitle": "Your subtitle"
    }
  }
}
```

---

#### Issue 5: Permission Denied

**Error:**
```bash
$ python -m src.main generate profile.json --output-dir /root/docs
❌ Error: Permission denied: '/root/docs'
```

**Solution:**
```bash
# Use accessible directory
python -m src.main generate profile.json --output-dir ./docs

# Or run with sudo (not recommended)
sudo python -m src.main generate profile.json --output-dir /root/docs

# Or fix permissions
chmod 755 /root/docs
```

---

#### Issue 6: Template Not Found

**Error:**
```bash
$ python -m src.main generate profile.json --template custom.j2
❌ Error: Template 'custom.j2' not found
```

**Solution:**
```bash
# Check template exists
ls -la templates/custom.j2

# Use absolute path
python -m src.main generate profile.json --template /path/to/custom.j2

# Check default templates directory
ls -la templates/
```

---

## 💡 Pro Tips & Best Practices

### Tip 1: Always Validate First
```bash
# ✅ GOOD: Validate before generating
python -m src.main validate profile.json --strict
python -m src.main generate profile.json

# ❌ BAD: Generate without validation
python -m src.main generate profile.json  # Might fail mid-generation
```

**Why:** Catch errors early, save time, ensure quality

---

### Tip 2: Use Verbose Mode for Debugging
```bash
# ✅ GOOD: Use verbose when troubleshooting
python -m src.main generate profile.json --verbose

# ❌ BAD: Silent execution when debugging
python -m src.main generate profile.json  # Hard to diagnose issues
```

**Why:** See detailed steps, identify bottlenecks, debug issues

---

### Tip 3: Version Control Generated Files
```bash
# Option 1: Commit generated READMEs (recommended for most projects)
git add README*.md
git commit -m "docs: update README files"

# Option 2: Ignore generated READMEs (for auto-generation pipelines)
echo "README*.md" >> .gitignore
```

**When to commit:**
- ✅ Manual updates
- ✅ Want to track changes
- ✅ README is primary documentation

**When to ignore:**
- ✅ Auto-generated in CI/CD
- ✅ Generated from external source
- ✅ Frequent automated updates

---

### Tip 4: Use Check Mode in CI/CD
```bash
# ✅ GOOD: Verify README is up-to-date
python -m src.main generate profile.json --check

# Add to CI pipeline
if ! python -m src.main generate profile.json --check; then
    echo "⚠️ README is outdated. Please regenerate."
    exit 1
fi
```

**Why:** Enforce documentation updates, prevent stale docs

---

### Tip 5: Create Custom Templates
```bash
# ✅ GOOD: Customize for your brand
cp templates/default.j2 templates/my-brand.j2
# Edit my-brand.j2 with custom styling
python -m src.main generate profile.json --template templates/my-brand.j2

# ❌ BAD: Manually edit generated READMEs
vim README.md  # Changes will be overwritten!
```

**Why:** Maintain consistency, automate styling, preserve customizations

---

### Tip 6: Use Shields.io for Badges
```json
{
  "badges": {
    "Python": "https://img.shields.io/badge/Python-3.10+-blue?style=for-the-badge&logo=python",
    "License": "https://img.shields.io/badge/License-MIT-green?style=flat-square",
    "Build": "https://img.shields.io/github/actions/workflow/status/user/repo/ci.yml?style=flat"
  }
}
```

**Resources:**
- [Shields.io](https://shields.io) - Badge generator
- [Simple Icons](https://simpleicons.org) - Brand logos
- [Badge Style Guide](https://github.com/badges/shields/blob/master/spec/SPECIFICATION.md)

---

### Tip 7: Keep Profiles DRY (Don't Repeat Yourself)
```json
{
  "readme": {
    "metadata": {
      "author": "John Doe",
      "year": 2025
    },
    "footer": {
      "copyright": {
        "owner": "{{ metadata.author }}",  // Reference metadata
        "year": "{{ metadata.year }}"       // Avoid duplication
      }
    }
  }
}
```

**Why:** Single source of truth, easier maintenance

---

### Tip 8: Use Environment Variables
```bash
# Set environment variables
export README_AUTHOR="Your Name"
export README_YEAR=2025

# Use in profile.json
{
  "readme": {
    "footer": {
      "copyright": {
        "owner": "${README_AUTHOR}",
        "year": "${README_YEAR}"
      }
    }
  }
}

# Generate
python -m src.main generate profile.json
```

**Why:** Dynamic configuration, CI/CD flexibility, multi-environment support

---

### Tip 9: Automate with Makefile
```makefile
# Makefile

.PHONY: validate generate check clean

validate:
	@echo "🔍 Validating profile..."
	python -m src.main validate src/data/profile.json --strict

generate: validate
	@echo "📝 Generating README files..."
	python -m src.main generate src/data/profile.json --lang all --verbose

check:
	@echo "✅ Checking if README is up-to-date..."
	python -m src.main generate src/data/profile.json --check

clean:
	@echo "🗑️  Cleaning generated files..."
	rm -f README*.md

all: validate generate

help:
	@echo "Available targets:"
	@echo "  validate  - Validate profile.json"
	@echo "  generate  - Generate README files"
	@echo "  check     - Check if README is up-to-date"
	@echo "  clean     - Remove generated files"
	@echo "  all       - Validate and generate"
```

**Usage:**
```bash
make validate
make generate
make check
make clean
```

---

### Tip 10: Document Your Profile Structure
```json
{
  "readme": {
    "_comment": "This is the main profile configuration for John Doe's GitHub README",
    "_version": "1.0.0",
    "_last_updated": "2025-12-29",

    "metadata": {
      "_comment": "Basic profile metadata",
      "title": "John Doe",
      "subtitle": "Full Stack Developer"
    },

    "about": {
      "_comment": "Professional summary and skills",
      "description": "..."
    }
  }
}
```

**Why:** Self-documenting configuration, easier maintenance, team collaboration

---

## 📞 Need More Help?

### Documentation

- 📖 [Main README](README.md) - Complete documentation
- 📝 [Changelog](CHANGELOG.md) - Version history
- 🤝 [Contributing](..github/CONTRIBUTING.md) - Contribution guidelines

### Support Channels

- 💬 [GitHub Discussions](https://github.com/GLASTOR/readme-generator/discussions) - Community support
- 🐛 [Issue Tracker](https://github.com/GLASTOR/readme-generator/issues) - Bug reports
- 📧 [Email](mailto:glastor.info@gmail.com) - Direct support

### Learning Resources

- 🎓 [Jinja2 Documentation](https://jinja.palletsprojects.com/) - Template syntax
- 📚 [JSON Schema](https://json-schema.org/) - Schema validation
- 🎨 [Shields.io](https://shields.io) - Badge generation

---

<div align="center">

**Found these examples helpful?** ⭐ Star the repo and share with others!

---

© 2010-2025 Andrés Antonio Cardoso

[⬆ Back to Top](#-usage-examples--tutorials)

</div>
