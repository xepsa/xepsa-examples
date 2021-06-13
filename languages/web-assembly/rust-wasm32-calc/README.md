# Rust WA Module - Calculator example

* Rust WA `Free Standing` module example.

* Build Target: `wasm32-unknown-unknown`.

* Simple `calculator` written in Rust. Run natively via `cargo`.

* Run via `wasmtime`, or, via `wasmer`.

---

## Notes

* Rust library - `cargo new --lib rust-wa-calc`.

* Rust entrypoint - `src/lib.rs`. No entrypoint function.

* Uses a project `crate-type` of `cdylib` .

    * By default, Rust generates an operating-system native library (even if you told it you wanted wasm!).
    
    * To get a compiled wasm file out of cargo, you’ll need to ensure the project’s library type is set to cdylib

* Uses the `extern` keyword tells the Rust compiler that the function is being exported.

* Uses the `no_mangle` attribute to prevent breaking optimisations by the compiler.

* Debug target created in `target/wasm32-unknown-unknown/debug`.

* Release target created in `target/wasm32-unknown-unknown/release`.


