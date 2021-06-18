// Define the Linear Memory Buffer
const MEMORY_BUFFER_SIZE: usize = 50;
static mut BUFFER: [u8; MEMORY_BUFFER_SIZE] = [0; MEMORY_BUFFER_SIZE];

/**
 * get_buffer_ptr, returns a pointer to a static, mutable array of fixed length.
 *
 * The host can use this pointer as an index offset into the shared linear memory
 * array for writing. Once the host has this pointer, it can write a name into the
 * section of memory used by the BUFFER array.
 *
 * This is an exported function.
 */
#[no_mangle]
pub extern "C" fn get_buffer_ptr() -> *const u8 {
    let pointer: *const u8 = { unsafe { BUFFER.as_ptr() } };
    pointer
}

/**
 * set_name, doesn’t actually set the name, it tells the guest that the name has been set
 * and,  more importantly, the length of that name.
 *
 * Without the length, the guest module can’t (easily or reliably) tell where the name ends
 * in the buffer.
 *
 * What’s implied but extremely important here is that the beginning of the name is the
 * beginning of the buffer.
 *
 * When the set_name function is called, the guest module replaces the name in the buffer
 * with a greeting that the host can use.
 */
#[no_mangle]
pub extern "C" fn set_name(len: i32) -> i32 {
    let name = unsafe { std::str::from_utf8(&BUFFER[..len as usize]).unwrap() };

    let greeting = format!("Module Log: {}", name);
    // Rust has a number of ways to do this more efficiently...
    // done "long hand" to illustrate what's happening
    unsafe {
        for (idx, byte) in greeting.as_bytes().iter().enumerate() {
            BUFFER[idx] = *byte;
        }
    }

    greeting.len() as i32
}
