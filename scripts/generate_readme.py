#!/usr/bin/env python3
import json
import datetime
from pathlib import Path
import requests

# Configuration
CONFIG = {
    "metadata": {
        "title": "Python & Cybersecurity Specialist",
        "subtitle": "Offensive Security | DevSecOps | Python Automation",
        "emoji": "🛡️",
        "version": "1.0.0",
        "language": "en",
        "keywords": ["Python", "Cybersecurity", "Pentesting", "DevSecOps"],
        "og_image": "https://i.postimg.cc/8zQZJX9L/cyber-banner.jpg"
    },
    "about": {
        "description": "Security-focused Python developer with expertise in offensive security, automation, and secure SDLC. Passionate about building secure systems and contributing to open-source security tools.",
        "core_skills": {
            "security": ["Penetration Testing", "Threat Modeling", "Vulnerability Research"],
            "python_ecosystem": ["Scapy", "PyCryptodome", "Requests", "Pwntools"],
            "devsecops": ["Docker Security", "Kubernetes Hardening", "CI/CD Security"]
        }
    },
    "badges": {
        "Python": "https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white",
        "Security": "https://img.shields.io/badge/Security-FF6D00?style=for-the-badge&logo=securityscorecard&logoColor=white",
        "Kali Linux": "https://img.shields.io/badge/Kali_Linux-557C94?style=for-the-badge&logo=kali-linux&logoColor=white",
        "Docker": "https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white",
        "OWASP": "https://img.shields.io/badge/OWASP-000000?style=for-the-badge&logo=owasp&logoColor=white",
        "GitHub Actions": "https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white"
    },
    "content": {
        "header": {
            "image": "https://i.postimg.cc/8zQZJX9L/cyber-banner.jpg",
            "link": "https://github.com/cyberpython-dev",
            "caption": "Security through automation ↓"
        },
        "quote": {
            "text": "Security is always excessive until it's not enough.",
            "author": "Robbie Sinclair",
            "icon": "🔒"
        },
        "projects": {
            "title": "Security Projects",
            "count": 6,
            "layout": "grid",
            "features": ["security_level", "stars"]
        },
        "contact": {
            "links": [
                {
                    "platform": "Keybase",
                    "url": "https://keybase.io/cyberpython",
                    "icon": "https://simpleicons.org/icons/keybase.svg"
                },
                {
                    "platform": "ProtonMail",
                    "url": "mailto:secure@protonmail.com",
                    "icon": "https://simpleicons.org/icons/protonmail.svg"
                },
                {
                    "platform": "GitHub",
                    "url": "https://github.com/cyberpython-dev",
                    "icon": "https://simpleicons.org/icons/github.svg"
                },
                {
                    "platform": "Twitter",
                    "url": "https://twitter.com/cyberpython",
                    "icon": "https://simpleicons.org/icons/twitter.svg"
                }
            ]
        }
    },
    "achievements": [
        {
            "title": "OSCP Certified",
            "year": 2023,
            "url": "https://www.offensive-security.com/offsec/certified-oscp/"
        },
        {
            "title": "AWS Certified Security Specialist",
            "year": 2024,
            "url": "https://aws.amazon.com/certification/"
        }
    ]
}

def load_banner():
    with open(Path("scripts/banner.txt"), "r") as f:
        return f.read()

def generate_badges(badges):
    return "\n".join([f"[![]({badges[key]})]({badges[key]})" for key in badges])

def generate_skills(skills):
    sections = []
    for category in skills:
        section = f"### {category.replace('_', ' ').title()}\n"
        section += ", ".join([f"`{skill}`" for skill in skills[category]])
        sections.append(section)
    return "\n\n".join(sections)

def generate_contact(links):
    items = []
    for link in links:
        items.append(f"[![]({link['icon']})]({link['url']} '{link['platform']}')")
    return " | ".join(items)

def generate_achievements(achievements):
    items = []
    for item in achievements:
        items.append(f"- [{item['title']} ({item['year']})]({item['url']})")
    return "\n".join(items)

def generate_readme():
    with open(Path("templates/readme_template.md"), "r") as f:
        template = f.read()

    today = datetime.datetime.now().strftime("%Y-%m-%d")

    replacements = {
        "{{TITLE}}": CONFIG["metadata"]["title"],
        "{{SUBTITLE}}": CONFIG["metadata"]["subtitle"],
        "{{EMOJI}}": CONFIG["metadata"]["emoji"],
        "{{VERSION}}": CONFIG["metadata"]["version"],
        "{{LAST_UPDATED}}": today,
        "{{BANNER}}": load_banner(),
        "{{DESCRIPTION}}": CONFIG["about"]["description"],
        "{{SKILLS}}": generate_skills(CONFIG["about"]["core_skills"]),
        "{{BADGES}}": generate_badges(CONFIG["badges"]),
        "{{QUOTE_TEXT}}": CONFIG["content"]["quote"]["text"],
        "{{QUOTE_AUTHOR}}": CONFIG["content"]["quote"]["author"],
        "{{QUOTE_ICON}}": CONFIG["content"]["quote"]["icon"],
        "{{CONTACT}}": generate_contact(CONFIG["content"]["contact"]["links"]),
        "{{ACHIEVEMENTS}}": generate_achievements(CONFIG["achievements"])
    }

    for placeholder, value in replacements.items():
        template = template.replace(placeholder, value)

    with open(Path("README.md"), "w") as f:
        f.write(template)

if __name__ == "__main__":
    generate_readme()
