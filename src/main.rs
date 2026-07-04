use chrono::Local;
use clap::Parser;
use colored::Colorize;
use regex::Regex;
use serde_json::Value;
use std::fs;
use std::path::Path;
use std::process;
use reqwest::header::USER_AGENT;

/// Generador de README en Rust
#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
struct Args {
    /// Archivo de plantilla (ej. README.profile.md)
    #[arg(short, long, default_value = "README.profile.md")]
    template: String,

    /// Archivo de salida
    #[arg(short, long, default_value = "README.md")]
    output: String,

    /// Sobrescribir archivo de salida si existe
    #[arg(short, long, default_value_t = false)]
    force: bool,

    /// Usuario de GitHub para generar estadísticas SVG
    #[arg(long)]
    github_user: Option<String>,
}

#[tokio::main]
async fn main() {
    let args = Args::parse();

    println!("{}", "Iniciando generador de README en Rust...".cyan().bold());

    // 1. Validar salida
    if Path::new(&args.output).exists() && !args.force {
        eprintln!("{}", format!("Error: El archivo de salida '{}' ya existe. Usa --force para sobrescribirlo.", args.output).red().bold());
        process::exit(1);
    }

    // 2. Cargar plantilla
    let template_content = match fs::read_to_string(&args.template) {
        Ok(content) => content,
        Err(e) => {
            eprintln!("{}", format!("Error al leer la plantilla '{}': {}", args.template, e).red().bold());
            process::exit(1);
        }
    };

    // 2.5. Generar SVG si se pide
    if let Some(user) = &args.github_user {
        println!("{}", format!("Generando estadísticas SVG para el usuario: {}...", user).yellow());
        match generate_github_stats(user).await {
            Ok(_) => println!("{}", "SVG de estadísticas generado en images/github_stats.svg".green()),
            Err(e) => eprintln!("{}", format!("Error generando SVG de GitHub: {}", e).red().bold()),
        }
    }

    // 3. Cargar configuración del proyecto (ej. .readmegen.json o deno.json)
    let project_name = "Proyecto Autogenerado";
    let description = "Descripción generada automáticamente con Rust 🦀";
    let badges = "[![Rust](https://img.shields.io/badge/Rust-Ready-orange)](https://rust-lang.org)";
    
    // Aquí podríamos leer archivos reales (como deno.json o package.json)
    // Para simplificar, utilizamos valores hardcodeados o leídos de un archivo de config
    let mut config_data = serde_json::json!({
        "projectName": project_name,
        "description": description,
        "badges": badges,
        "toc": "- [Instalación](#instalación)\n- [Uso](#uso)",
        "installation": "cargo build --release",
        "usage": "./target/release/glastor-dev",
        "basicExample": "let x = 1;",
        "apiDocs": "Consulta la documentación en `/docs`.",
        "dependencies": "- clap\n- serde\n- serde_json\n- regex",
        "ci": "[![CI](https://github.com/workflows/ci.yml/badge.svg)](...)",
        "testCommand": "cargo test",
        "contributing": "Abre un PR para contribuir.",
        "license": "MIT",
        "customSections": "",
        "current_date": Local::now().format("%Y-%m-%d").to_string(),
        "current_year": Local::now().format("%Y").to_string(),
        "version": env!("CARGO_PKG_VERSION")
    });

    // Leer .readmegen.json si existe
    if let Ok(config_str) = fs::read_to_string(".readmegen.json") {
        if let Ok(parsed_config) = serde_json::from_str::<Value>(&config_str) {
            if let Some(obj) = parsed_config.as_object() {
                for (k, v) in obj {
                    if let Some(v_str) = v.as_str() {
                        config_data[k] = serde_json::json!(v_str);
                    }
                }
            }
        }
    }

    // 4. Reemplazar variables (estilo {{variable}})
    let mut output_content = template_content.clone();
    
    // Buscamos todos los placeholders de tipo {{var}}
    let re = Regex::new(r"\{\{([a-zA-Z0-9_]+)\}\}").unwrap();
    
    output_content = re.replace_all(&output_content, |caps: &regex::Captures| {
        let key = &caps[1];
        match config_data.get(key) {
            Some(val) => {
                if let Some(str_val) = val.as_str() {
                    str_val.to_string()
                } else {
                    val.to_string()
                }
            },
            None => format!("{{{{{}}}}}", key), // Dejar intacto si no se encuentra
        }
    }).to_string();

    // 5. Escribir salida
    match fs::write(&args.output, output_content) {
        Ok(_) => println!("{}", format!("¡Éxito! README generado en: {}", args.output).green().bold()),
        Err(e) => {
            eprintln!("{}", format!("Error al escribir el archivo de salida: {}", e).red().bold());
            process::exit(1);
        }
    }
}

async fn generate_github_stats(username: &str) -> Result<(), Box<dyn std::error::Error>> {
    let client = reqwest::Client::new();
    
    // Fetch user info
    let user_url = format!("https://api.github.com/users/{}", username);
    let user_res: Value = client.get(&user_url)
        .header(USER_AGENT, "glastor-dev")
        .send()
        .await?
        .json()
        .await?;
        
    let followers = user_res["followers"].as_i64().unwrap_or(0);
    let public_repos = user_res["public_repos"].as_i64().unwrap_or(0);

    // Fetch repos
    let repos_url = format!("https://api.github.com/users/{}/repos?per_page=100", username);
    let repos_res: Value = client.get(&repos_url)
        .header(USER_AGENT, "glastor-dev")
        .send()
        .await?
        .json()
        .await?;
        
    let mut stars = 0;
    let mut forks = 0;
    
    if let Some(repos) = repos_res.as_array() {
        for repo in repos {
            stars += repo["stargazers_count"].as_i64().unwrap_or(0);
            forks += repo["forks_count"].as_i64().unwrap_or(0);
        }
    }

    // Leer plantilla SVG
    let svg_template = fs::read_to_string("images/stats.template.svg")?;
    
    // Reemplazar valores
    let svg_output = svg_template
        .replace("{{username}}", username)
        .replace("{{repos}}", &public_repos.to_string())
        .replace("{{followers}}", &followers.to_string())
        .replace("{{stars}}", &stars.to_string())
        .replace("{{forks}}", &forks.to_string());
        
    // Guardar
    fs::write("images/github_stats.svg", svg_output)?;
    
    Ok(())
}

