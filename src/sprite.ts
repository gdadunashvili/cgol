export class vec2d {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export type Box = {
  pos: vec2d,
  size: {width: number, height: number}
}

export class Sprite {

  bounding_box: Box;
  attack_box: Box;

  vel: vec2d;
  standup_height: number;
  duck_height: number;
  style: string;
  last_key: string;
  life: number;
  damage: number;

  constructor(pos: vec2d, vel: vec2d, style: string) {
    this.vel = vel;
    const height: number = 150;
    this.bounding_box = { pos: pos, size: {width: 50, height: height} };

    this.standup_height = height;
    this.duck_height = height*0.6;

    this.style = style;
    this.attack_box = {
      pos: this.bounding_box.pos,
      size: {width: 100, height: 50}
    }

    this.life = 100;
    this.damage = 10;

  }

  draw(c: CanvasRenderingContext2D) {
    c.fillStyle = this.style;
    c.fillRect(this.bounding_box.pos.x, this.bounding_box.pos.y, 
               this.bounding_box.size.width, this.bounding_box.size.height);
    c.fillStyle = 'white';
    c.fillRect(this.attack_box.pos.x, this.attack_box.pos.y, 
               this.attack_box.size.width, this.attack_box.size.height);
  }

  update(c: CanvasRenderingContext2D,
         canvas: HTMLCanvasElement, 
         gravity: number) {
    this.draw(c);

    if(this.bounding_box.pos.y+this.bounding_box.size.height >= canvas.height){
      this.vel.y = 0;
      this.bounding_box.pos.y -= 
        this.bounding_box.pos.y + this.bounding_box.size.height - canvas.height; 
    } else{
      this.vel.y += gravity;
    }
    if(this.bounding_box.pos.x < 0 || 
       this.bounding_box.pos.x+this.bounding_box.size.width > canvas.width){
      this.vel.x *= -1;
    }
    this.bounding_box.pos.x += this.vel.x;
    this.bounding_box.pos.y += this.vel.y;
  }
}
