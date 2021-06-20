extern crate wapc_guest as guest;

use guest::prelude::*;

// Invoked by host crate.
// Registers 'operation_handlers'.
// Registers a handler for a function called 'SayHello'.
#[no_mangle]
pub extern "C" fn wapc_init() {
    register_function("SayHello", do_hello);
}

// SayHello operation 'do_hello' handler function
// 1. Pull name from payload.
// 2. Ask host for greeting string.alloc
// 3. Format ans return the result.
fn do_hello(msg: &[u8]) -> CallResult {
    let name = std::str::from_utf8(msg)?;
    let res = host_call("default", "sample", "GetGreeting", &vec![])?;
    let greeting = std::str::from_utf8(&res)?;
    let output = format!("{}, {}!", greeting, name);

    Ok(output.as_bytes().to_vec())
}
