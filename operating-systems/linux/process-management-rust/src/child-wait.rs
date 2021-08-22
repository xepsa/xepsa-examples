use std::process::exit;
use std::thread::sleep;
use std::time::Duration;

use nix::sys::wait::waitpid;
use nix::unistd::{fork, getpid, getppid, ForkResult};

// * The execution starts from the main process which reports its PID and immediately creates a child
//   process by forking itself.
//
// * The child process, in turn, reports its PID and PPID, but then falls asleep before the termination.
//
// * The execution of the parent process continues to the next line after the fork() call regardless of
//   the child's behavior.
//
// * The main process uses waitpid() call to pause itself until the child's exit status will be available.

fn main() {
    println!("[main] Hi there! My PID is {}.", getpid());

    let child_pid = match fork() {
        Ok(ForkResult::Child) => {
            //////////////////////
            //      child       //
            //////////////////////
            println!(
                "[child] I'm alive! My PID is {} and PPID is {}.",
                getpid(),
                getppid()
            );

            println!("[child] I'm gonna sleep for a while and then just exit...");
            sleep(Duration::from_secs(2));
            exit(0);
        }

        Ok(ForkResult::Parent { child, .. }) => {
            println!("[main] I forked a child with PID {}.", child);
            child
        }

        Err(err) => {
            panic!("[main] fork() failed: {}", err);
        }
    };

    println!("[main] I'll be waiting for the child termination...");
    match waitpid(child_pid, None) {
        Ok(status) => println!("[main] Child exited with status {:?}", status),
        Err(err) => panic!("[main] waitpid() failed: {}", err),
    }
    println!("[main] Bye Bye!");
}
