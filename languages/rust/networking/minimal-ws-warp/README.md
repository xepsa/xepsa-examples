# minimal-ws-warp

## Overview

* Basic async TCP socket example using `tokio`.

* HTTP support using `warp`. 

* Opens up a socket on `127.0.0.1:8080`.

* Logs connections.

---

## Uses

* Uses `tokio = { version = "1.2", features = ["full"] }` crate.

* Uses `warp = "0.3"` crate.

* Uses `#[tokio::main]` macro to intercept main.

---

## Usage

* In a terminal run: `cargo run`

* In a terminal run: `curl localhost:8080/hello; echo`