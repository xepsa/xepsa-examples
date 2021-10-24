NAME := checkers

.PHONY build:
build:
	wat2wasm $(NAME).wat -o $(NAME).wasm

.PHONY size:
size:
	@ls -lA | grep $(NAME).wasm | cut -d ' ' -f 7

.PHONY test:
test:
	@python3 -m http.server
	# Open http://0.0.0.0:8000/checkers-test.html and look at the dev console.

.PHONY clean:
clean:
	rm $(NAME).wasm
