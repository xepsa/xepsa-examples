# minimal-http

## Overview

* Basic TCP socket example.

* Opens up a socket on `127.0.0.1:8080`.

* Reads a stream and converts it to a UTF-8 string, and prints it to the terminal.

* Returns an HTTP 200 response.

---

## Libraries

* Uses `use std::net::TcpListener` to open the `socket` and register a `handler function` (handlestream).

* Uses`use std::net::TcpStream` to read the `request` and send the `response`.

---

## Usage

* In a terminal run: `cargo run`

* In a terminal run: `curl localhost:8080 -d 'Testing.'`