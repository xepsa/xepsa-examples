use std::io::Read;
use std::{error::Error, fs::File};

use wasm3::Module;
use wasm3::{CallContext, Environment};

fn main() -> Result<(), Box<dyn Error>> {
    let env = Environment::new()?;
    let rt = env.create_runtime(1024 * 60)?;

    let bytes = {
        let mut f = File::open("../rust-wasm32-importer/target/wasm32-unknown-unknown/release/rust_wasm32_importer.wasm")?;

        let mut bytes = vec![];
        f.read_to_end(&mut bytes)?;
        bytes
    };

    let module = Module::parse(&env, &bytes)?;
    let mut module = rt.load_module(module)?;

    // link_closure - binds the external function to a rust closure and make it available
    // to the importing module under 'utilities' with the function name 'random'.
    if let Err(_e) = module.link_closure(
        "utilities",
        "random",
        move |_ctx: &CallContext, ()| -> i32 {
            use rand::Rng;
            let mut rng = rand::thread_rng();
            rng.gen_range(0, 100)
        },
    ) {
        return Err("Failed to link closure".into());
    }

    let addto = module.find_function::<i32, i32>("addto")?;

    println!("Result: {}", addto.call(10)?);

    Ok(())
}
