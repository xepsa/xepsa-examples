use std::net::TcpStream;

use std::io::{Read, Write};
use std::str;

fn main() {
    let mut stream = TcpStream::connect("localhost:3000").unwrap();
    // Write Request
    stream.write("Hello".as_bytes()).unwrap();
    // Read Response
    let mut buffer = [0; 5];
    stream.read(&mut buffer).unwrap();
    println!(
        "Got response from server: {:?}",
        str::from_utf8(&buffer).unwrap()
    );
}

// v1
//
// fn main() {
//     let _stream = TcpStream::connect("localhost:3000").unwrap();
// }
