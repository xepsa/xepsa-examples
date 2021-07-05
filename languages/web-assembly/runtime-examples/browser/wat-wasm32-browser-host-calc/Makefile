DIR    := ${CURDIR}
INPUT  := src
OUTPUT := target
NAME   := calc

# Build WA Module with wat2wasm.
.PHONY: build-wa-module
build-wa-module:
	mkdir -p $(DIR)/$(OUTPUT)
	wat2wasm $(DIR)/$(INPUT)/$(NAME).wat -o $(DIR)/$(OUTPUT)/$(NAME).wasm
	cp $(DIR)/$(INPUT)/index.html $(DIR)/$(OUTPUT)
	cp $(DIR)/$(INPUT)/index.js $(DIR)/$(OUTPUT)

# Object Dump WA Module via wasm-objdump.
.PHONY: dump-wa-module
dump-wa-module:
	wasm-objdump -x $(DIR)/$(OUTPUT)/$(NAME).wasm

# Decompile WA Module via wasm2wat.
.PHONY: decompile-wa-module
decompile-wa-module:
	wasm2wat $(DIR)/$(OUTPUT)/$(NAME).wasm

# Run WA Module via wasmer.
.PHONY: run-browser
run-wasmer:
	python3 -m http.server 8000

.PHONY: clean
clean:
	rm -rf $(OUTPUT)

