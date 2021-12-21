use std::collections::HashSet;

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

// Random Movement
//
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct RandomMove;

// Wants to move - A Message of Intent
//
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct WantsToMove {
    pub entity: Entity,
    pub destination: Point,
}

// Wants to attack - A Message of Intent
//
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct WantsToAttack {
    pub attacker: Entity,
    pub victim: Entity,
}

// Health
//
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct Health {
    pub current: i32,
    pub max: i32,
}

// Entity Names
//
#[derive(Clone, PartialEq)]
pub struct Name(pub String);

// Chase Player
//
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct ChasePlayer;

// Generic Item
//
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct Item;

// Amulet
//
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct AmuletOfWotnot;

// Field of View
//
#[derive(Clone, Debug, PartialEq)]
pub struct FieldOfView {
    pub visible_tiles: HashSet<Point>,
    pub radius: i32,
    pub is_dirty: bool,
}
impl FieldOfView {
    pub fn new(radius: i32) -> Self {
        Self {
            visible_tiles: HashSet::new(),
            radius,
            is_dirty: true,
        }
    }

    pub fn clone_dirty(&self) -> Self {
        Self {
            visible_tiles: HashSet::new(),
            radius: self.radius,
            is_dirty: true,
        }
    }
}

// Health Potion
//
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct ProvidesHealing {
    pub amount: i32,
}

// Dungeon Map
//
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct ProvidesDungeonMap;
