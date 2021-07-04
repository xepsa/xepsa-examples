.PHONY: build
build:
	cargo build --target wasm32-unknown-unknown

.PHONY: sign
sign:
	wash claims sign target/wasm32-unknown-unknown/debug/rust_wasmcloud_bank_actor.wasm -k -q --name "Bank Actor"

.PHONY: verify	
verify:
	wash claims inspect target/wasm32-unknown-unknown/debug/rust_wasmcloud_bank_actor_s.wasm

.PHONY: clean
clean:
	rm -rf $(OUTPUT)

