use macroquad::prelude::*;

pub struct Game {
    pub quit: bool,
    pub player_state: PlayerState,
}

impl Game {
    pub fn new() -> Self {
        Self { 
            quit: false,
            player_state: PlayerState { 
                position: Vec2::new(100f32, 100f32), 
                rotation: 0f32, 
            } 
        }
    }

    pub fn update(&mut self) {
        if  is_key_down(KeyCode::Escape) {
            self.quit = true;
        }
    } 

    pub fn draw(& self) {
        clear_background(color_u8!(255, 255, 255, 255));

        // Draws a triangle from a circle definition.
        draw_poly_lines(
            // Centroid.
            self.player_state.position.x,
            self.player_state.position.y,
            // Number of sides (triangle).
            3,
            // Radius.
            10.0f32,
            // Rotation (in degrees - so convert from radians).
            self.player_state.rotation * 180.0f32 / std::f32::consts::PI - 90.0f32,
            // Stroke thickness.
            2.0f32,
            // Color.
            BLACK
        );
        draw_box(Vec2::new(400f32, 200f32), Vec2::new(50f32, 20f32));
    }
}

pub struct PlayerState {
    pub position: Vec2,
    pub rotation: f32,
}

fn draw_box(pos: Vec2, size: Vec2) {
    let dimension = size * 2.;
    let upper_left = pos - size;
    draw_rectangle(upper_left.x, upper_left.y, dimension.x, dimension.y, BLACK); 
}


#[macroquad::main("game")]
async fn main() {
    let mut game = Game::new();
    loop {
        game.update();
        game.draw();
        if game.quit {
            return;
        }
        next_frame().await;
    }
}
