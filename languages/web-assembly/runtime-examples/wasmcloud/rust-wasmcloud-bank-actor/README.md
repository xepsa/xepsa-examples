# wasmCloud Bank Actor Example


## Usage

1. Ensure `wasmcloud` runtime and `wash` CLI are installed.

    ```bash
    # Update Repository
    curl -s https://packagecloud.io/install/repositories/wasmcloud/core/script.deb.sh | sudo bash
    ## Install 'wasmcloud' runtime and 'wash' CLI.
    sudo apt install wasmcloud wash
    ```

2. Build Module

    ```bash
    cargo build --target wasm32-unknown-unknown
    ```

3. Sign Module

    ```bash
    wash claims sign target/wasm32-unknown-unknown/debug/rust_wasmcloud_bank_actor.wasm -k -q --name "Bank Actor"
    ```

4. Verify Module

    ```bash
    wash claims inspect target/wasm32-unknown-unknown/debug/rust_wasmcloud_bank_actor_s.wasm
    ```

5. Configure `manifest.yaml` by exporting the `module public key`.

    ```bash
    wash claims inspect target/wasm32-unknown-unknown/debug/rust_wasmcloud_bank_actor_s.wasm
    # Grep 'Module'.
    export VAULT_ACTOR=MAHUHHQNILLDRPX5IRNOVUH2U2SCTSJ636E42G4TCIBKAQFOBUSS74TW
    ```

6. Start the required `redis` dependency.

    ```bash
    docker run -p 6379:6379 -d redis
    ```

7. Start the required `wasmcloud` runtime.

    ```bash
    wasmcloud -m ./manifest.yaml
    ```

    NB: Ensure the file is saved and formatted correctly.

8. Play with the vault.

    ```bash
    curl localhost:8080/vault; echo
    # Deposit 100
    curl -X PUT http://localhost:8080/vault -d '{"gold": 100}'
    curl localhost:8080/vault; echo
    # Withdraw 10
    curl -X DELETE http://localhost:8080/vault -d '{"gold": 10}'
    curl localhost:8080/vault; echo
    ```

8. Start CLI session.

    ```bash
    wash up
    # Type 'quit' to exit.
    ```

---

## Notes

* There is quite a bit “missing” compared to the types of microservices we’re familiar with building.

* The result of a handler for HTTP requests is a struct containing a representation of an HTTP response, not an imperative set of calls to push data over an HTTP connection.

    * We don’t even supply a port number for the HTTP server or explicitly start it.

* There is no connection string or configuration anywhere for the key-value store.

    * This information is actually provided at runtime via what wasmCloud calls link definitions between actors and capability providers.

    * Interface

        * None of the code is even aware of which key-value store is being used.

        * Can swap one implementation for another, at runtime, without even losing messages.