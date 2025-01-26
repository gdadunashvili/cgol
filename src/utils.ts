export class vec2d {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export enum DIRECTION {LEFT=-1, RIGHT=1};

export type Box = {
  pos: vec2d,
  size: {width: number, height: number}
}


