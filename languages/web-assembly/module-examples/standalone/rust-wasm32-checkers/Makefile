# .PHONY: build
# build:
# 	# Build release
# 	cargo build --release --target wasm32-unknown-unknown

NAME := rust_wasm32_checkers
TEST_SERVER := test-server

.PHONY build:
build:
	cargo build --release --target wasm32-unknown-unknown

.PHONY test-server: build
test-server:
	@ mkdir -p $(TEST_SERVER)
	@cp ./host/checkers-test.html $(TEST_SERVER)
	@cp ./host/checkers-test.js $(TEST_SERVER)
	@cp ./target/wasm32-unknown-unknown/release/rust_wasm32_checkers.wasm $(TEST_SERVER)

.PHONY size:
size:
	@cd $(SERVER) && ls -lA | grep $(NAME).wasm | cut -d ' ' -f 7

.PHONY run-test-server: test-server
run-test-server:
	@cd $(SERVER) && python3 -m http.server
	# Open http://0.0.0.0:8000/checkers-test.html and look at the dev console.

.PHONY clean:
clean:
	rm -Rf $(TEST_SERVER)
	rm -Rf target