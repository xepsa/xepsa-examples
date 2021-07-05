DIR    := ${CURDIR}
INPUT  := src
OUTPUT := target
NAME   := forLoop

# Build WA Module with wat2wasm.
.PHONY: build-wa-module
build-wa-module:
	mkdir -p $(DIR)/$(OUTPUT)
	wat2wasm $(DIR)/$(INPUT)/$(NAME).wat -o $(DIR)/$(OUTPUT)/$(NAME).wasm

# Object Dump WA Module via wasm-objdump.
.PHONY: dump-wa-module
dump-wa-module:
	wasm-objdump -x $(DIR)/$(OUTPUT)/$(NAME).wasm

# Decompile WA Module via wasm2wat.
.PHONY: decompile-wa-module
decompile-wa-module:
	wasm2wat $(DIR)/$(OUTPUT)/$(NAME).wasm

# Run WA Module via wasmtime.
.PHONY: run-wasmtime
run-wasmtime:
	wasmtime $(DIR)/$(OUTPUT)/$(NAME).wasm --invoke forLoop

# Run WA Module via wasmer.
.PHONY: run-wasmer
run-wasmer:
	wasmer $(DIR)/$(OUTPUT)/$(NAME).wasm --invoke forLoop

.PHONY: clean
clean:
	rm -rf $(OUTPUT)

