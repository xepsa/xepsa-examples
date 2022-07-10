use macroquad::prelude::*;

pub struct Game {
    pub quit: bool,
    pub retro_mode: bool,
    pub player_state: PlayerState,
    pub texture: Texture2D,
}

impl Game {

    pub async fn new() -> Self {
        let texture = load_texture("assets/plane.png").await.unwrap();
        Self { 
            quit: false,
            retro_mode: false,
            player_state: PlayerState { 
                position: Vec2::new(100f32, 100f32), 
                rotation: 0f32, 
            },
            texture,
        }
    }

    pub fn update(&mut self) {

        const ROTATION_SPEED: f32 = 0.015;
        const SPEED: f32 = 0.5;

        self.player_state.position += vec2_from_angle(self.player_state.rotation) * SPEED;

        if  is_key_down(KeyCode::Escape) {
            self.quit = true;
        }

        if is_key_down(KeyCode::Right) {
            self.player_state.rotation += ROTATION_SPEED;
        }

        if is_key_down(KeyCode::Left) {
            self.player_state.rotation -= ROTATION_SPEED;
        }

        if is_key_down(KeyCode::R) {
            self.retro_mode = ! self.retro_mode;
        }

        if self.player_state.position.x > screen_width() {
            self.player_state.position.x = -self.texture.width();
        } else if self.player_state.position.x < -self.texture.width() {
            self.player_state.position.x = screen_width();
        }
        if self.player_state.position.y > screen_height() {
            self.player_state.position.y = -self.texture.height();
        } else if self.player_state.position.y < -self.texture.height() {
            self.player_state.position.y = screen_height();
        }

    } 

    pub fn draw(& self) {
        clear_background(color_u8!(255, 255, 255, 255));

        if self.retro_mode {
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
        } else  {
            draw_texture_ex(
                self.texture,
                self.player_state.position.x,
                self.player_state.position.y,
                WHITE,
                DrawTextureParams { rotation: self.player_state.rotation, ..Default::default() },
            );
        }

        // draw_box(Vec2::new(400f32, 200f32), Vec2::new(50f32, 20f32));
    }
}

pub fn vec2_from_angle(angle: f32) -> Vec2 {
    let angle = angle - std::f32::consts::FRAC_PI_2;
    Vec2::new(angle.cos(), angle.sin())
}


pub struct PlayerState {
    pub position: Vec2,
    pub rotation: f32,
}

// fn draw_box(pos: Vec2, size: Vec2) {
//     let dimension = size * 2.;
//     let upper_left = pos - size;
//     draw_rectangle(upper_left.x, upper_left.y, dimension.x, dimension.y, BLACK); 
// }


#[macroquad::main("game")]
async fn main() {
    let mut game = Game::new().await;
    loop {
        game.update();
        game.draw();
        if game.quit {
            return;
        }
        next_frame().await;
    }
}
