use std::io::prelude::*;
use std::net::TcpListener;
use std::net::TcpStream;

fn main() {
    let listener = TcpListener::bind("127.0.0.1:8080").unwrap();
    for stream in listener.incoming() {
        let stream = stream.unwrap();
        println!("stream accepted {:?}", stream);
        handle_stream(stream);
    }
}

fn handle_stream(mut stream: TcpStream) {
    let mut buffer = [0; 1024];
    stream.read(&mut buffer).unwrap();

    let rq = String::from_utf8_lossy(&buffer[..]);
    println!("Request All: {}", rq);

    let http_rs_hdr = "HTTP/1.1 200 OK\r\n\r\n";
    let http_rs_bdy = "Request Received\n";
    let rs = format!("{}{}", http_rs_hdr, http_rs_bdy);

    stream.write(rs.as_bytes()).unwrap();
    stream.flush().unwrap();
}
