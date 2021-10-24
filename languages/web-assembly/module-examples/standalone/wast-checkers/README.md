# WAT Checkers

## Overview

* Simple WAST `checkers` game model.

* Uses `mem` for the pieces and board state.

* Uses `global` for BitFlags and game turn.

---

## Build

```bash
wat2wasm checkers.wat
```

---

## Decompile

```bash
# Details
wasm-objdump -x checkers.wasm
# Disassemble
wasm-objdump -d checkers.wasm
# Headers
wasm-objdump -h checkers.wasm
# Full Contents.
wasm-objdump -s checkers.wasm
```

---

## Test

1. Start HTTP server:

    ```bash
    python3 -m http.server
    ```

2. Open: http://0.0.0.0:8000/checkers-test.html

    * Open `DevTools` and check console.