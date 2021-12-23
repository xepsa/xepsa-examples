mod template;

use crate::prelude::*;

use self::template::Templates;

// Spawner manages the creation of the entities and the components (attributes and behaviours)
// of each entity.
//
// Each spawned entity gets pushed onto the ECS Game State.

// Player
//
pub fn spawn_player(ecs: &mut World, pos: Point) {
    ecs.push((
        Player { map_level: 0 },
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
        Damage(1),
    ));
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

pub fn spawn_level(
    ecs: &mut World,
    rng: &mut RandomNumberGenerator,
    level: usize,
    spawn_points: &[Point],
) {
    let template = Templates::load();
    template.spawn_entities(ecs, rng, level, spawn_points);
}
