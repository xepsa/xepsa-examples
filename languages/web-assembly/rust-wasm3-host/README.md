# Wasm3 Rust Host

* Host a pre-supplied `calc.wasm` using `Wasm3 Rust binding` host.

* Demonstrates module function look up.

---

## Notes

* Need `Clang 9` installed to build.

* Need Wasm3 dependency with `bindgen` feature.

    ```toml
    wasm3 = {version = "0.1.3", features = ["build-bindgen"]}
    ```