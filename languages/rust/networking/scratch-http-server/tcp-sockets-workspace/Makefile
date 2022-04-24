.PHONY run-tcp-server:
run-tcp-server:
	cargo run -p tcpserver

.PHONY run-tcp-client:
run-tcp-client:
	cargo run -p tcpclient

.PHONY run-http-server:
run-http-server:
	cargo run -p httpserver

.PHONY unit-test-http-lib:
unit-test-http-lib:
	cargo test -p http

.PHONY integ-test-http-server:
integ-test-http-server:
	curl localhost:3000/
	curl localhost:3000/health
	curl localhost:3000/api/shipping/orders
	curl localhost:3000/invalid-path