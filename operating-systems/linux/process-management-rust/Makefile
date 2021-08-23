.PHONY: child-wait
child-wait:
	cargo run --bin child-wait

.PHONY: child-wait-busy-loop
child-wait-busy-loop:
	cargo run --bin child-wait-busy-loop

.PHONY: child-wait-sig-handler
child-wait-sig-handler:
	cargo run --bin child-wait-sig-handler

.PHONY: grandchild-wait-subreaper
grandchild-wait-subreaper:
	cargo run --bin grandchild-wait-subreaper

.PHONY: catch-parent-death-child
catch-parent-death-child:
	cargo run --bin catch-parent-death-child

.PHONY: catch-parent-death-parent
catch-parent-death-parent:
	cargo build --bin catch-parent-death-child
	cargo run --bin catch-parent-death-parent