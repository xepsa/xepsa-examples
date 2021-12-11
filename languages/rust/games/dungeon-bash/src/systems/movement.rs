use crate::prelude::*;

// The movement system iterates all entities with a WantsToMove component. It then
// checks that the move is valid, and if it is, replaces the Point component of the
// target entity. If the entity is a player, it also updates the camera.
//
#[system(for_each)] // Short hand to find the Player.
#[read_component(Player)]
pub fn movement(
    entity: &Entity,
    want_move: &WantsToMove,
    #[resource] map: &Map,
    #[resource] camera: &mut Camera,
    ecs: &mut SubWorld,
    commands: &mut CommandBuffer,
) {
    if map.can_enter_tile(want_move.destination) {
        // Add the command to the buffer.
        commands.add_component(want_move.entity, want_move.destination);

        // Check the Player exists and update the Camera.
        if ecs
            .entry_ref(want_move.entity)
            .unwrap()
            .get_component::<Player>()
            .is_ok()
        {
            camera.on_player_move(want_move.destination);
        }
    }
    // Remove the command/message once it has been processed.
    commands.remove(*entity);
}
