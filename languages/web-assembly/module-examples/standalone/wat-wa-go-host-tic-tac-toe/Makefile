DIR    := ${CURDIR}
INPUT  := src
OUTPUT := target
NAME   := tic-tac-toe

# go run toerunner.go

# Handle golang wasmer deps
.PHONY: deps
deps:
	go get github.com/wasmerio/wasmer-go/wasmer 

# Build WA Module with wat2wasm.
.PHONY: build-wa-module
build-wa-module:
	mkdir -p $(DIR)/$(OUTPUT)
	wat2wasm $(DIR)/$(INPUT)/$(NAME).wat -o $(DIR)/$(OUTPUT)/$(NAME).wasm
	cp $(DIR)/$(INPUT)/runner.go $(DIR)/$(OUTPUT)/runner.go

# Object Dump WA Module via wasm-objdump.
.PHONY: dump-wa-module
dump-wa-module:
	wasm-objdump -x $(DIR)/$(OUTPUT)/$(NAME).wasm

# Decompile WA Module via wasm2wat.
.PHONY: decompile-wa-module
decompile-wa-module:
	wasm2wat $(DIR)/$(OUTPUT)/$(NAME).wasm

# Run WA Module via Go host.
.PHONY: run-go-host
run-go-host:
	cd $(OUTPUT) && go run runner.go && cd ..

.PHONY: clean
clean:
	rm -rf $(OUTPUT)

