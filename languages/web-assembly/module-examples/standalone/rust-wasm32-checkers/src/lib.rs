// mod board;
// mod game;

// Imported Functions
//
// Importing functions from a host is done by including their signatures in an
// extern block.
extern "C" {
    fn notify_piecemoved(fromX: i32, fromY: i32, toX: i32, toY: i32);
    fn notify_piececrowned(x: i32, y: i32);
}

#[macro_use]
extern crate lazy_static; // 'extern crate' required for 2015 Edition
extern crate mut_static; // 'extern crate' required for 2015 Edition

use board::{Coordinate, GamePiece, Move, PieceColor};
use game::GameEngine;
use mut_static::MutStatic;

// Use a lazy MutStatic global variable to hold teh game state.
// NB: Not desirable in normal Rust programs, but, required for WASM host integration.
lazy_static! {
    pub static ref GAME_ENGINE: MutStatic<GameEngine> = MutStatic::from(GameEngine::new());
}

// Exported Functions
//

// Create external function for communication with host.
// NB: Must communicate with types WA understands.
#[no_mangle]
pub extern "C" fn move_piece(fx: i32, fy: i32, tx: i32, ty: i32) -> i32 {
    let mut engine = GAME_ENGINE.write().unwrap();
    let mv = Move::new((fx as usize, fy as usize), (tx as usize, ty as usize));
    let res = engine.move_piece(&mv);
    match res {
        Ok(mr) => {
            unsafe {
                // This is a callback notification function that needs to be imported from the host.
                notify_piecemoved(fx, fy, tx, ty);
            }
            if mr.crowned {
                unsafe {
                    // This is a callback notification function that needs to be imported from the host.
                    notify_piececrowned(tx, ty);
                }
            }
            1
        }
        Err(_) => 0,
    }
}

// Create external function for communication with host.
// NB: Must communicate with types WA understands.
#[no_mangle]
pub extern "C" fn get_piece(x: i32, y: i32) -> i32 {
    let engine = GAME_ENGINE.read().unwrap();

    let piece = engine.get_piece(Coordinate(x as usize, y as usize));
    match piece {
        Ok(Some(p)) => p.into(),
        Ok(None) => -1,
        Err(_) => -1,
    }
}

// Create external function for communication with host.
// NB: Must communicate with types WA understands.
#[no_mangle]
pub extern "C" fn get_current_turn() -> i32 {
    let engine = GAME_ENGINE.read().unwrap();

    GamePiece::new(engine.current_turn()).into()
}

const PIECEFLAG_BLACK: u8 = 1;
const PIECEFLAG_WHITE: u8 = 2;
const PIECEFLAG_CROWN: u8 = 4;

impl Into<i32> for GamePiece {
    // The fact that the self variable here is not a reference means that the GamePiece
    // will be 'consumed' when converted into an integer - subsequent access will produce
    // a 'move after use' compile error.
    fn into(self) -> i32 {
        let mut val: u8 = 0;
        if self.color == PieceColor::Black {
            val += PIECEFLAG_BLACK;
        } else if self.color == PieceColor::White {
            val += PIECEFLAG_WHITE;
        }

        if self.crowned {
            val += PIECEFLAG_CROWN;
        }

        val as i32
    }
}

mod board;
mod game;
