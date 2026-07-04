# Justfile para glastor-dev
# Requiere 'just' instalado: `cargo install just`

default: help

# Muestra esta ayuda
help:
	@just --list

# Compila el proyecto en modo release
build:
	cargo build --release

# Genera el README.md a partir del template
generate:
	cargo run -- --force

# Ejecuta las pruebas unitarias
test:
	cargo test

# Ejecuta pruebas de cobertura (requiere cargo-tarpaulin)
coverage:
	cargo tarpaulin --ignore-tests

# Revisa el formato del código
fmt:
	cargo fmt --all -- --check

# Ejecuta el linter (clippy)
lint:
	cargo clippy --all-targets --all-features -- -D warnings

# Limpia los binarios construidos y los bloqueos temporales
clean:
	cargo clean
