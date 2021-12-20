use crate::prelude::*;

// Spawner manages the creation of the entities and the components (attributes and behaviours)
// of each entity.
//
// Each spawned entity gets pushed onto the ECS Game State.

// Player
//
pub fn spawn_player(ecs: &mut World, pos: Point) {
    ecs.push((
        Player,
        pos,
        Render {
            color: ColorPair::new(WHITE, BLACK),
            glyph: to_cp437('@'),
        },
        Health {
            current: 10,
            max: 10,
        },
        FieldOfView::new(8),
    ));
}

// Monster
//
// pub fn spawn_monster(ecs: &mut World, rng: &mut RandomNumberGenerator, pos: Point) {
//     ecs.push((
//         Enemy,
//         pos,
//         Render {
//             color: ColorPair::new(WHITE, BLACK),
//             glyph: match rng.range(0, 4) {
//                 0 => to_cp437('E'),
//                 1 => to_cp437('O'),
//                 2 => to_cp437('o'),
//                 _ => to_cp437('g'),
//             },
//         },
//         RandomMove {},
//     ));
// }

pub fn spawn_monster(ecs: &mut World, rng: &mut RandomNumberGenerator, pos: Point) {
    let (hp, name, glyph) = match rng.roll_dice(1, 10) {
        1..=8 => goblin(),
        _ => orc(),
    };
    ecs.push((
        Enemy,
        pos,
        Render {
            color: ColorPair::new(WHITE, BLACK),
            glyph,
        },
        // RandomMove {},
        ChasePlayer {},
        Health {
            current: hp,
            max: hp,
        },
        Name(name),
        FieldOfView::new(6),
    ));
}

fn goblin() -> (i32, String, FontCharType) {
    (1, "Goblin".to_string(), to_cp437('g'))
}

fn orc() -> (i32, String, FontCharType) {
    (2, "Orc".to_string(), to_cp437('o'))
}

pub fn spawn_amulet_of_wotnot(ecs: &mut World, pos: Point) {
    ecs.push((
        Item,
        AmuletOfWotnot,
        pos,
        Render {
            color: ColorPair::new(WHITE, BLACK),
            glyph: to_cp437('|'),
        },
        Name("Amulet of Wotnot".to_string()),
    ));
}
