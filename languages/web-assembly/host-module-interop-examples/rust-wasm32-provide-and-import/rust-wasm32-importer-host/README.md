# Notes

* `module.link_closure`

    * The host needs to know how to satisfy a request for a given import and to invoke that import on behalf of the guest WebAssembly module (modules running inside a host are often referred to as `guests`).

* This code maps a Rust closure that generates a random number to the module utilities with the function named random.

