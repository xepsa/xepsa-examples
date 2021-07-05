DIR  := ${CURDIR}
NAME :=  rust-wasi-wordcounter

# Build WA Module from Rust with cargo.
.PHONY: build-wa-module
build-wa-module:
	cargo build --target wasm32-wasi

# Run WA Module via wasmtime.
.PHONY: run-wasmtime
run-wasmtime:
	wasmtime --dir=$(DIR) $(DIR)/target/wasm32-wasi/debug/$(NAME).wasm $(DIR)/src/main.rs

# Run WA Module via wasmer.
.PHONY: run-wasmer
run-wasmer:
	wasmer --dir=$(DIR) $(DIR)/target/wasm32-wasi/debug/$(NAME).wasm $(DIR)/src/main.rs

# Run the wc module natively with cargo
.PHONY: run-native
run-native:
	cargo run -- $(DIR)/src/main.rs

.PHONY: clean
clean:
	rm -rf target

