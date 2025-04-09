import { vec2d, Box, DIRECTION } from './utils';

export class Player {

  bounding_box: Box;
  attack_box: Box;

  id: number;
  vel: vec2d;
  direction: DIRECTION;
  standup_height: number;
  duck_height: number;
  style: string;
  last_key: string;
  is_atacking: boolean;
  life: number;
  life_display: number;
  base_damage: number;

  private offset_attac_box(){
    let x_offset:number;
    switch(this.direction){
      case DIRECTION.LEFT: 
        x_offset = -this.attack_box.size.width;
        break;
      case DIRECTION.RIGHT:
        x_offset = this.bounding_box.size.width;
        break;
    }

    this.attack_box.pos.x = this.bounding_box.pos.x + x_offset;
    this.attack_box.pos.y = this.bounding_box.pos.y;

  }

  constructor(id: number, pos: vec2d, vel: vec2d, direction: DIRECTION, style: string) {
    this.id = id;
    this.vel = vel;
    const height: number = 150;
    this.bounding_box = { pos: pos, size: {width: 50, height: height} };
    this.direction = direction; 

    this.standup_height = height;
    this.duck_height = height*0.6;

    this.style = style;


    this.attack_box = {
      pos: {x: 0, y:0},
      size: {width: 100, height: 50}
    }

    this.offset_attac_box();

    this.life = 30;
    this.base_damage = 1;

  }
 
  draw(c: CanvasRenderingContext2D) {
    c.fillStyle = this.style;
    c.fillRect(this.bounding_box.pos.x, this.bounding_box.pos.y, 
               this.bounding_box.size.width, this.bounding_box.size.height);

    if(this.is_atacking){
      c.fillStyle = 'red';

      // if(KeyboardEvent.
      c.fillRect(this.attack_box.pos.x, this.attack_box.pos.y, 
                 this.attack_box.size.width,
                 this.attack_box.size.height);
    }

  }

  update(c: CanvasRenderingContext2D,
         canvas: HTMLCanvasElement, 
         gravity: number, other: Player) {
    this.draw(c);

    this.offset_attac_box();
    let diff: number = other.bounding_box.pos.x - this.bounding_box.pos.x;
    if(diff > 0){ this.direction = DIRECTION.RIGHT };
    if(diff < 0){ this.direction = DIRECTION.LEFT };

    if(this.bounding_box.pos.y+this.bounding_box.size.height >= canvas.height){
      this.vel.y = 0;
      this.bounding_box.pos.y -= 
        this.bounding_box.pos.y + this.bounding_box.size.height - canvas.height; 
    } else{
      this.vel.y += gravity;
    }
    if(this.bounding_box.pos.x <= 0 ){
      this.bounding_box.pos.x = 1;
    }
    if(this.bounding_box.pos.x+this.bounding_box.size.width >= canvas.width){
      this.bounding_box.pos.x = canvas.width - this.bounding_box.size.width - 1; 
    }
    this.bounding_box.pos.x += this.vel.x;
    this.bounding_box.pos.y += this.vel.y;

    this.life_display = Math.max(this.life, 0)
    let life_text = document.getElementById(`health${this.id}`)!;
    life_text.innerHTML =  `health P1: ${this.life_display}`; 
    
  }
}
