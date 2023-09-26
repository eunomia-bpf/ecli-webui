# ecli-web

Front-end for ecli.

Current Avaliable feature:
+ Control ecli-server running on local by dev proxy

## Project Setup

```sh
bun install
```

### Generate OpenAPI codes

```sh
bun run gen-api
```

### Compile and Hot-Reload for Development

```sh
bun dev
```

### Type-Check, Compile and Minify for Production

```sh
bun run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
bun run lint
```

## Teck Stack:

Base: `Vue3 / vite`  
Style: `Tailwindcss`  
State manage: `Pinia`

## Todo

[ ] Integrate Online Build
[ ] CROS fork of ecli-server
[ ] Improve view
