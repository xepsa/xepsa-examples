use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::net::TcpListener;

#[tokio::main]
async fn main() {
    let listener = TcpListener::bind("127.0.0.1:8080").await.unwrap();

    loop {
        let (mut stream, _) = listener.accept().await.unwrap();
        println!("stream accepted {:?}", stream);

        tokio::spawn(async move {
            let mut buf = [0; 1024];

            loop {
                match stream.read(&mut buf).await {
                    Ok(_) => {
                        stream.write_all(b"HTTP/1.1 200 OK\r\n\r\n").await.unwrap();
                        stream.flush().await.unwrap();
                        return;
                    }
                    Err(e) => println!("{:?}", e),
                }
            }
        });
    }
}
