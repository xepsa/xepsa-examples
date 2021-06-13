DIR  := ${CURDIR}
NAME := rust_wa_calc

# Build WA Module from Rust with cargo.
.PHONY: build-wa-debug-module
build-wa-debug-module:
	cargo build --target wasm32-unknown-unknown

# Build WA Module from Rust with cargo.
.PHONY: build-wa-release-module
build-wa-release-module:
	cargo build --target wasm32-unknown-unknown --release

# Build WA Module from Rust with cargo.
.PHONY: decompile-wa-release-module
decompile-wa-release-module:
	wasm2wat $(DIR)/target/wasm32-unknown-unknown/release/$(NAME).wasm

# Run WA Module via wasmtime.
.PHONY: run-wasmtime
run-wasmtime:
	wasmtime $(DIR)/target/wasm32-unknown-unknown/release/$(NAME).wasm --invoke add 3 5

# Run WA Module via wasmer.
.PHONY: run-wasmer
run-wasmer:
	wasmer $(DIR)/target/wasm32-unknown-unknown/release/$(NAME).wasm --invoke add 3 5

# Run the wc module natively with cargo
.PHONY: run-native
run-native:
	cargo run -- $(DIR)/src/main.rs

.PHONY: clean
clean:
	rm -rf target

