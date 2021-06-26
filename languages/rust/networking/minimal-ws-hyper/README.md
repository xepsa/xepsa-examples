# minimal-ws-hyper

## Overview

* Basic async TCP socket example using `tokio`.

* HTTP support using `hyper`. 

    * NB: `hyper` does not provide support for cookies, web-sockets, static files, and other high-level features.

* Opens up a socket on `127.0.0.1:8080`.

* Logs connections.

---

## Uses

* Uses `tokio = { version = "1.2", features = ["full"] }` crate.

* Uses the `hyper = { version = "0.14", features = ["full"] }` crate

* Uses `#[tokio::main]` macro to intercept main.

---

## Usage

* In a terminal run: `cargo run`

* In a terminal run: `curl localhost:8080; echo`