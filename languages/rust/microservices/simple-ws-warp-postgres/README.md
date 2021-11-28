# simple-ws-warp-postgres

* https://github.com/importcjj/mobc

* https://diesel.rs/


## Overview

* Create a simple Rust API using `warp`.

* Basic async TCP socket example using `tokio`.

* HTTP support using `warp`. 

* Opens up a socket on `127.0.0.1:8080`.

* Logs connections.

---

## Uses

* Uses `warp = "0.2"`

* Uses `parking_lot = "0.10.0"`

* Uses `serde = { version = "1.0", features = ["derive"] }`

* Uses `tokio = { version = "0.2", features = ["macros"] }`

* Uses `#[tokio::main]` macro to intercept main.

---

## Usage

* In a terminal run: `cargo run`

* In a terminal run: `curl localhost:8080/hello; echo`


---

## Resources

* Based of these tutorials: 

* [Creating a REST API in Rust with warp](https://blog.logrocket.com/creating-a-rest-api-in-rust-with-warp/).

* [Create an async CRUD web service in Rust with warp](https://blog.logrocket.com/create-an-async-crud-web-service-in-rust-with-warp/)

