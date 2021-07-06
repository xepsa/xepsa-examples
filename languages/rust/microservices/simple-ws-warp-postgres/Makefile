.PHONY run:
run:
	cargo run

.PHONY build:
run:
	cargo build

.PHONY clean:
clean:
	cargo clean

.PHONY dev-start:
dev-start:
	docker run --name xepsa-postgres -p 7878:5432 -d postgres:9.6.12

.PHONY dev-stop:
dev-stop:
	docker stop xepsa-postgres
	docker rm xepsa-postgres

.PHONY db-psql:
db-psql:
	docker exec -it xepsa-postgres psql -U postgres