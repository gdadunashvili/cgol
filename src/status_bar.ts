import { DIRECTION, Box } from './utils';

export class FillBar {
  box: Box
  color: string;
  fill_fraction: number;
  fill_dir: DIRECTION;

  constructor(box: Box, fill_fraction: number, fill_dir: DIRECTION){

    this.box = box;
    this.fill_fraction = fill_fraction;
    this.fill_dir = fill_dir;
  }

  update(new_fill_fraction: number){ 
    this.fill_fraction = new_fill_fraction; 
    if(this.fill_fraction > 0.8){ this.color = 'green' }
    else if(this.fill_fraction > 0.7){ this.color = 'lightgreen' }
    else if(this.fill_fraction > 0.6) {this.color = 'yellow'}
    else if(this.fill_fraction > 0.3) {this.color = 'orange'}
    else {this.color = 'red'}

  }
  draw(c: CanvasRenderingContext2D) {
    c.fillStyle = this.color;
    c.strokeStyle = this.color;
    let w: number = this.fill_fraction;
    c.beginPath();
    c.rect(this.box.pos.x, this.box.pos.y, this.box.size.width, this.box.size.height);
    c.stroke();

    switch(this.fill_dir){
      case DIRECTION.RIGHT:
        c.fillRect(this.box.pos.x, this.box.pos.y, w*this.box.size.width, this.box.size.height);
        break;
      case DIRECTION.LEFT:
        c.fillRect(this.box.pos.x+(1-w)*this.box.size.width, this.box.pos.y, w*this.box.size.width, this.box.size.height);
      break;
    }

  }
}
