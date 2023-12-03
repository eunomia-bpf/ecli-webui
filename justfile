default:
  @just --choose

gen-api:
	bun run gen-api

build: gen-api
	bun run build

dev: gen-api
	bun run dev
