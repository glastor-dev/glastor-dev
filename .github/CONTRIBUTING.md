# Contribuir

Gracias por querer contribuir a **GLASTOR**.

## Requisitos

- Deno 2.x

## Setup local

```bash
git clone https://github.com/glastor-dev/glastor-dev.git
cd glastor-dev
```

## Comandos útiles

```bash
deno task fmt:check
deno task lint
deno task check
deno task test
```

## README (perfil) autogenerado

Este repo genera `README.md` desde `README.profile.md`.

Antes de abrir un PR, ejecuta:

```bash
deno task readme:force
```

Y verifica que no quede diff:

```bash
deno task readme:check
git diff --no-index -- README.md README.generated.md
```

## Flujo de PR

1) Crea una rama desde `master`
2) Mantén el PR pequeño y enfocado
3) Asegura `deno task fmt:check`, `deno task lint`, `deno task check` y `deno task test` en verde

## Políticas

- Código de conducta: [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)
- Seguridad: [SECURITY.md](./SECURITY.md)
- Soporte: [SUPPORT.md](./SUPPORT.md)
