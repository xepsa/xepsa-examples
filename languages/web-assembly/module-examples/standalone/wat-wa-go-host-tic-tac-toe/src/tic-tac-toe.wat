(module
    (memory $mem 1)
    ;; X plays first
    (global $currentTurn (mut i32) (i32.const 1))
    (global $X i32 (i32.const 1))
    (global $Y i32 (i32.const 2))
    (global $EMPTY i32 (i32.const 0))

    ;; Linearize a 3x3 tic-tac-toe board
    (func $indexForPosition (param $row i32) (param $col i32) (result i32)
        (i32.add
            (i32.mul
                (i32.const 3)
                (get_local $row)
            )
            (get_local $col)
        )
    )

    ;; Offset = ( index ) * 4
    (func $offsetForPosition (param $row i32) (param $col i32) (result i32)
        (i32.mul
        (call $indexForPosition (get_local $row) (get_local $col))
        (i32.const 4)
        )
    )

    ;; Sets a piece in the board. No error checking is done here
    (func $setPiece (param $row i32) (param $col i32) (param $piece i32)
        (i32.store
            (call $offsetForPosition
                (get_local $row)
                (get_local $col)
            )
            (get_local $piece)
        )
    )

    ;; Places the current player's piece in the given location
    ;; advances to next player
    (func $takeTurn (param $row i32) (param $col i32)
        (call $setPiece
            (get_local $row)
            (get_local $col)
            (get_global $currentTurn)
        )
        (call $advanceTurn)
    )

    ;; Retrieves the value of the piece at a given position on
    ;; the board. No error checking done here.
    (func $getPiece (param $row i32) (param $col i32) (result i32)
        (i32.load
            (call $offsetForPosition
                (get_local $row)
                (get_local $col)
            )
        )
    )

    ;; Called to switch the current turn
    (func $advanceTurn
        (if (i32.eq (get_global $currentTurn) (get_global $X))
            (then (set_global $currentTurn (get_global $Y)))
            (else (set_global $currentTurn (get_global $X)))
        )
    )

    (func $getCurrent (result i32)
        (get_global $currentTurn)
    )

    ;; Initializes the game board
    (func $initGame
        (local $r i32)
        (local $c i32)

        (block
            (loop
                                
                (set_local $r (i32.const 0))
                (block
                    (loop
                        (call $setPiece
                            (get_local $r)
                            (get_local $c)
                            (get_global $EMPTY)
                        )
                        (set_local $c (call $inc (get_local $c)))
                        (br_if 1 (i32.eq (get_local $c) (i32.const 3)))
                        (br 0)
                    )
                )

                (set_local $r (call $inc (get_local $r)))
                (br_if 1 (i32.eq (get_local $r) (i32.const 3)))
                (br 0)
            )
        )        
    )

    ;; Shortcut for adding 1
    (func $inc (param $a i32) (result i32)
        (i32.add
            (get_local $a)
            (i32.const 1)
        )
    )

    (export "initGame" (func $initGame))
    (export "getPiece" (func $getPiece))
    (export "currentTurn" (func $getCurrent))
    (export "takeTurn" (func $takeTurn))
    (export "memory" (memory $mem))
)