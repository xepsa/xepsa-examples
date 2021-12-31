.PHONY: build
build:
	wasm-pack build

.PHONY: test
test:
	wasm-pack test --headless --firefox

.PHONY: publish
publish:
	wasm-pack publish

.PHONY: start
start:
	cd host && npm run start
