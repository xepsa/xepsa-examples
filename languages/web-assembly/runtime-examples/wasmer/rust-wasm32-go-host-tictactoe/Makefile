DIR          := ${CURDIR}
INPUT        := src
OUTPUT       := target
NAME         := tictactoe
WASM_RELEASE := $(DIR)/$(OUTPUT)/wasm32-unknown-unknown/release/rust_wasm32_go_host_$(NAME).wasm

# go run toerunner.go

.PHONY: deps
deps:
	go get github.com/wasmerio/wasmer-go/wasmer 

# Build WA Module from Rust with cargo. --release
.PHONY: build-wa-module
build-wa-module:
	cargo build --target wasm32-unknown-unknown --release
	cp $(DIR)/$(INPUT)/runner.go $(DIR)/$(OUTPUT)/runner.go

# Object Dump WA Module via wasm-objdump.
.PHONY: dump-wa-module
dump-wa-module:
	wasm-objdump -x $(WASM_RELEASE)

# Decompile WA Module via wasm2wat.
.PHONY: decompile-wa-module
decompile-wa-module:
	wasm2wat $(WASM_RELEASE)

# Run WA Module via Go host.
.PHONY: run-go-host
run-go-host:
	cd $(OUTPUT) && go run runner.go && cd ..


.PHONY: clean
clean:
	rm -rf $(OUTPUT)

