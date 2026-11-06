![Glastor banner](images/banner-github.webp)

<div align="center">

# 🔧 GLASTOR® — Engineering Setup, Toolbox & Continuous Learning

**Entorno de ingeniería de sistemas, herramientas de desarrollo diario y bibliografía de arquitectura de `Andres A. Cardoso` (`@glastor-dev`).**

[⬅️ Volver al Perfil Principal (`README.md`)](./README.md) • [🏢 Organización (`glastor-core`)](https://github.com/glastor-core) • [💙 Programa de Sponsors (`SPONSORS.md`)](./SPONSORS.md) • [🌐 Sitio Oficial (`glastor.es`)](https://glastor.es)

</div>

---

## 🖥️ Entorno de Ingeniería & Workstations

### Sistemas Operativos

- 🐧 **Arch Linux** (Workstation Principal) — Kernel 6.x optimizado para baja latencia
  - **Window Manager:** `i3-gaps` + `Polybar`
  - **Terminal & Shell:** `Zsh` + `Oh-My-Zsh` + `tmux`
- 🪟 **Windows 10/11 Pro + WSL2 (Ubuntu LTS)** — Entorno secundario de validación cruzada y testing multi-plataforma

### Editores, LSP & Diagnóstico

- ⚡ **Neovim** (`LazyVim` + configuración Lua modular) — Edición de ultra-baja latencia y sesiones remotas SSH
  - **Servidores LSP:** `rust-analyzer`, `pyright`, `denols`, `tsserver`
- 💻 **VS Code** — Debugging complejo, perfiles de rendimiento y contenedores remotos
  - **Extensiones Core:** Rust Analyzer, Python, Deno, ESLint, Prettier, GitLens, Docker
  - **Tema:** _Quimera Theme_ (desarrollo propio)

### Control de Versiones & Flujo de Trabajo

- 🔧 **Git CLI + Lefthook** — Automatización de hooks pre-commit (`deno lint`, `deno fmt --check`, auditoría 4R)
- 🦑 **GitKraken PRO** — Gestión visual de grafos complejos y auditoría de ramas
- 🤖 **GitHub CLI (`gh`) & GitHub Actions** — Orquestación de releases, reglas de gobernanza y CI/CD

---

## 🎯 Especialización por Dominio Técnico

| Dominio                         | Tecnologías, Protocolos y Patrones                                                                                                                                                       |
| :------------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Backend & Sistemas Críticos** | Microservicios en **Rust** (`Tokio`, `Axum`, memoria segura y concurrencia libre de _data races_) y APIs de alto tráfico en **Python** (`FastAPI`, `Django REST Framework`, `AsyncIO`).  |
| **Edge Runtimes & APIs**        | Motores sobre **Deno 2**, **Bun** y **Hono**; gateways con _Circuit Breaker_, deduplicación _Single-Flight_, `gRPC`, `GraphQL` (_Strawberry_ / _Ariadne_) y **OpenAPI 3.1**.             |
| **DevSecOps & Infraestructura** | Contenedores multi-stage en **Docker**, orquestación en **Kubernetes (CKA)**, **AWS** (`EC2`, `Lambda`, `RDS`, `S3`), **Terraform (IaC)** y pipelines predictivos en **GitHub Actions**. |
| **Seguridad & Criptografía**    | Mitigación **OWASP Top 10**, autenticación `JWT` / `OAuth2`, cifrado `AES` / `RSA`, escaneo estático (`CodeQL`, `nemesis`) y trazabilidad de cadena de suministro (**SLSA**).            |
| **IA, AST & Automatización**    | Compiladores y análisis estático con **TypeScript AST**, generación nativa de `llms.txt`, agentes de IA, **LangChain** y automatización determinística en **Rust / Python / Bash**.      |

---

## 📚 Bibliografía de Referencia & Formación Continua

### Libros de Cabecera en Arquitectura y Sistemas

- ✅ _Designing Data-Intensive Applications_ — **Martin Kleppmann**
- ✅ _Site Reliability Engineering: How Google Runs Production Systems_ — **Betsy Beyer et al.**
- ✅ _Building Microservices (2nd Edition)_ — **Sam Newman**
- ✅ _Clean Architecture_ — **Robert C. Martin**
- ✅ _The Pragmatic Programmer (20th Anniversary Edition)_ — **David Thomas & Andrew Hunt**

### Certificaciones & Especializaciones

- 🏆 **AWS Certified Solutions Architect** & **DevOps Specialist**
- 🎓 **Certified Kubernetes Administrator (CKA)** y **Advanced PostgreSQL Performance Tuning**
- 🎯 Investigación continua: _Deterministic Execution Engines_, _Edge AI Gateways_ y _Predictive AST CI_.

### Podcasts Técnicos Recomendados

- 🎙️ _Software Engineering Daily_
- 🎙️ _The Changelog_
- 🎙️ _Talk Python To Me_ & _Python Bytes_

---

<div align="center">

[⬅️ Volver al Perfil Principal (`README.md`)](./README.md) • [🏢 Ir a `glastor-core`](https://github.com/glastor-core) • [🌐 Visitar `glastor.es`](https://glastor.es)

<sub>© 2010–2026 GLASTOR® — Marca registrada en Argentina (INPI Reg. 4559568 y 4559567). Todos los derechos reservados.</sub>

</div>
