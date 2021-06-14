# Rust WA Module - Word Counter example

* Rust WA `WASI` module example.

* Build Target: `wasm32-wasi`.

* Simple `word counter` written in Rust. Run natively via `cargo`.

* The `WASI` module is wrapping a `Rust Application`.

* Run via `wasmtime`, or, via `wasmer`.

---

## Build 

* `wasm32-wasi` module compile target IS required.

* `[lib] crate-type="cdylib"` IS NOT required. We are building a WASI module with main function.

* By default, Rust generates an `operating-system native library` (even if you told it you wanted wasm!).
    
* Debug target created in `target/wasm32-wasi/debug`.

* Release target created in `target/wasm32-wasi/release`.

---
## Notes

* Rust executable - `cargo new --bin rust-wa-wordcounter`

* Rust entrypoint - `src/main.rs`. `main`.

* No special attributes. Built as a `WASI` module and exposing a `main` function.





