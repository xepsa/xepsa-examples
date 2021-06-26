# minimal-tcp-tokio

## Overview

* Basic async TCP socket example using `tokio`.

* Opens up a socket on `127.0.0.1:8080`.

* Logs connections.

---

## Libraries

* Uses `tokio = { version = "1.2", features = ["full"] }` crate.

* Uses `tokio::net::TcpListener` to create an async TCP socket.

* Uses `tokio::io::{AsyncReadExt, AsyncWriteExt}` to perform async read/write operations.

* Uses `#[tokio::main]` macro to intercept main.

---

## Usage

* In a terminal run: `cargo run`

* In a terminal run: `curl localhost:8080`