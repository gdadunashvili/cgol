import { play_hit_sound } from "./sounds";
import { Player } from "./sprite";
import { Box } from "./utils";

export type ControleKeys = {
  left: string, 
  right: string, 
  up: string, 
  down: string, 
  attack: string
}

function bounce(entity: Player, other_entity: Player, overlap: number) {
  const pos = entity.bounding_box.pos;
  const other_pos = other_entity.bounding_box.pos;

  const s = other_pos.x  - pos.x > 0 ? 1 : -1;
  other_pos.x += overlap * s*0.7;
}
function knock_back(entity: Player, other_entity: Player, overlap: number) {
  const pos = entity.bounding_box.pos;
  const other_pos = other_entity.bounding_box.pos;

  const s = other_pos.x  - pos.x > 0 ? 1 : -1;
  pos.x -= overlap * s*0.3;
}

function collision_detector(entity: Box, other_entity: Box): number {
  const pos = entity.pos;
  const other_pos = other_entity.pos;
  const size = entity.size;
  const other_size = other_entity.size;

  if (pos.x < other_pos.x + other_size.width &&
      pos.x + size.width > other_pos.x &&
      pos.y < other_pos.y + other_size.height &&
      pos.y + size.height > other_pos.y){
    return size.width + other_size.width - Math.abs(pos.x - other_pos.x);
  }

  return 0;
}

export function entity_controller(entity: Player, 
                          other_entity: Player,
                          canvas: HTMLCanvasElement,
                          keys: { [key: string]: boolean },
                          controle_keys: ControleKeys){

  const speed = 5;
  const jump = 20;
  entity.vel.x = 0; 
  if(keys[controle_keys.left] && 
     (entity.last_key === controle_keys.left 
       || entity.last_key === controle_keys.up) 
    ) { 
      entity.vel.x = -speed; 
    }

  if(keys[controle_keys.right] && 
     (entity.last_key === controle_keys.right
       || entity.last_key === controle_keys.up) 
     ) { 
       entity.vel.x = speed; 
     }

  if(keys[controle_keys.up]){ 
    if(entity.bounding_box.pos.y > canvas.height - 1.05*entity.bounding_box.size.height){
      entity.bounding_box.pos.y -= 1.1;
      entity.vel.y = -jump; 
    }
    keys.w = false
  }

  entity.is_atacking = false;
  if(keys[controle_keys.attack]){
    entity.is_atacking = true;
    let overlap: number = collision_detector(entity.attack_box,
                                             other_entity.bounding_box);
    if (overlap>0){
      play_hit_sound();
      bounce(entity, other_entity, overlap);
      knock_back(entity, other_entity, overlap);

      other_entity.life -= entity.damage;
    }
  }

  if(keys[controle_keys.down]){ 
    entity.bounding_box.size.height = entity.duck_height;
  }
  else{ 
    entity.bounding_box.size.height = entity.standup_height;
  }
}

