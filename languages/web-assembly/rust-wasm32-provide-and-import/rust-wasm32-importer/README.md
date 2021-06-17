# Rust Wasm32 Module with system `random` function import

* Import a `random` function from the system runtime.

* Adds a random number to an integer.

* See `rust-wasm32-importer-host` for the host environment.

---

## Notes - Wasm32 Module

* `cargo new --lib rust-wasm32-importer`

* `Cargo.toml` configured to make Rust tool chain build `wasi` module instead of `system executable`.

    ```toml
    [lib]
    crate-type = ["cdylib"]
    ```

* Rust `link` attribute and `extern` keyword used to __import__ system `random` function.

    ```rust
    #[link(wasm_import_module = "utilities")]
    extern "C" {
        pub fn random() -> i32;
    }
    ```

    * NB: We just export the imported function prototype.

* Rust `no_mangle` attribute used to preserve function names.

    ```rust
    #[no_mangle]
    ```

* Rust `unsafe` block is required to invoke the imported function as the Rust compiler cannot guarantee it's safety.

* `wasm32-unknown-unknown` module compile target IS required.

* `[lib] crate-type="cdylib"` IS required. We are building a freestanding module of exported functions.


---

## Notes Host

* `cargo new --bin host`

