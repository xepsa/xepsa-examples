#[derive(Debug, Clone, PartialEq, Copy)]
enum GamePiece {
    X = 2,
    O = 1,
    Empty = 0,
}

static mut GAME_BOARD: &'static mut [GamePiece] = &mut [GamePiece::Empty; 9];

static mut TURN: GamePiece = GamePiece::X;

fn get_piece(index: usize) -> GamePiece {
    unsafe { GAME_BOARD[index] }
}

fn set_piece(index: usize, piece: GamePiece) {
    unsafe { GAME_BOARD[index] = piece }
}

// Public.

#[no_mangle]
#[export_name = "initGame"]
pub extern "C" fn init_game() {
    unsafe {
        // TODO: Reset
        // GAME_BOARD = &mut [GamePiece::Empty; 9];
        for i in 0..8 {
            GAME_BOARD[i] = GamePiece::Empty;
        }
        TURN = GamePiece::X;
    }
}

#[no_mangle]
#[export_name = "takeTurn"]
pub extern "C" fn take_turn(row: i32, col: i32) {
    let idx: usize = ((row * 3) + col) as usize;
    unsafe {
        set_piece(idx, TURN);
        if TURN == GamePiece::X {
            TURN = GamePiece::O;
        } else if TURN == GamePiece::O {
            TURN = GamePiece::X;
        } else {
            panic!("Inconsistent TURN state.")
        }
    }
}

#[no_mangle]
#[export_name = "currentTurn"]
pub extern "C" fn current_turn() -> i32 {
    unsafe {
        return TURN as i32;
    }
}

#[no_mangle]
#[export_name = "getPiece"]
pub extern "C" fn pub_get_piece(row: i32, col: i32) -> i32 {
    let idx: usize = ((row * 3) + col) as usize;
    return get_piece(idx) as i32;
}
