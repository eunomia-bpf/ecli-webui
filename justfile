default:
  @just --choose

gen-api:
	pnpm run gen-api

build: gen-api
	pnpm run build

dev: gen-api
	pnpm run dev
