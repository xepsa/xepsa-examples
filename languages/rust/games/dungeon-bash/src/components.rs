pub use crate::prelude::*;

// Components -----------------------------------------------------------------
//

// Render
//
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct Render {
    pub color: ColorPair,
    pub glyph: FontCharType,
}

// Player
//
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct Player;

// Enemy
//
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct Enemy;
