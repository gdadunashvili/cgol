import { Sprite } from './sprite';
import { ControleKeys, entity_controller } from './entity_controller';

const CANVAS = document.querySelector('canvas')!;
let CONTEXT = CANVAS.getContext('2d')!;

CONTEXT.fillRect(0,  0, CANVAS.width, CANVAS.height);
const GRAVITY: number = 0.7;

const PLAYER = new Sprite( {x: 500, y: 0}, {x: 0, y: 0}, 'red');
const ENEMY = new Sprite( {x: 100, y: 10}, {x: 0, y: 0}, 'blue');

let KEYS: {[key: string]: boolean} = {};
let PLAYER_CONTROLLER_KEYS: ControleKeys = {left:'a', right:'d', up:'w', down:'s', attack:'q'}
let ENEMY_CONTROLLER_KEYS = {left:'ArrowLeft', right:'ArrowRight', up:'ArrowUp', down:'ArrowDown', attack:' '}

function animate() {
  requestAnimationFrame(animate);
  CONTEXT.fillStyle = 'black';
  CONTEXT.fillRect(0, 0, CANVAS.width, CANVAS.height);
  PLAYER.update(CONTEXT, CANVAS, GRAVITY);
  ENEMY.update(CONTEXT, CANVAS, GRAVITY);

  entity_controller(PLAYER, ENEMY, CANVAS, KEYS, PLAYER_CONTROLLER_KEYS)
  entity_controller(ENEMY, PLAYER, CANVAS, KEYS, ENEMY_CONTROLLER_KEYS)

}

animate();

window.addEventListener('keydown', (event) => {
  KEYS[event.key] = true 
  if(Object.values(PLAYER_CONTROLLER_KEYS).includes(event.key)){ PLAYER.last_key = event.key; } 
  if(Object.values(ENEMY_CONTROLLER_KEYS).includes(event.key)){ ENEMY.last_key = event.key; }
})

window.addEventListener('keyup', (event) => { KEYS[event.key] = false })
