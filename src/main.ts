import { Player} from './sprite';
import { ControleKeys, entity_controller } from './entity_controller';
import { FillBar } from './status_bar';
import { DIRECTION } from './utils';

const CANVAS = document.querySelector('canvas')!;
let CONTEXT = CANVAS.getContext('2d')!;

CONTEXT.fillRect(0,  0, CANVAS.width, CANVAS.height);
const GRAVITY: number = 0.7;
const HEALTH_WIDTH = 300;
const HEALTH_HEIGHT = 9;
const PLAYER = new Player(1, {x: 1, y: 0}, {x: 0, y: 0}, DIRECTION.RIGHT, 'green');
const HEALT_BAR_PLAYER = new FillBar({pos:{x:10, y:10}, size:{width: HEALTH_WIDTH, height: HEALTH_HEIGHT}}, 1, DIRECTION.RIGHT);
const ENEMY = new Player(2, {x: 500, y: 10}, {x: 0, y: 0},DIRECTION.LEFT, 'blue');
const HEALT_BAR_ENEMY = new FillBar({pos:{x:CANVAS.width - HEALTH_WIDTH - 10, y:10}, size:{width: HEALTH_WIDTH, height: HEALTH_HEIGHT}}, 1, DIRECTION.LEFT);

let KEYS: {[key: string]: boolean} = {};
let PLAYER_CONTROLLER_KEYS: ControleKeys = {left:'a', right:'d', up:'w', down:'s', attack:'c'}
let ENEMY_CONTROLLER_KEYS = {left:'ArrowLeft', right:'ArrowRight', up:'ArrowUp', down:'ArrowDown', attack:','}

function animate() {
  requestAnimationFrame(animate);
  CONTEXT.fillStyle = 'black';
  CONTEXT.fillRect(0, 0, CANVAS.width, CANVAS.height);
  PLAYER.update(CONTEXT, CANVAS, GRAVITY, ENEMY);
  HEALT_BAR_PLAYER.update(PLAYER.life_display/100);
  HEALT_BAR_PLAYER.draw(CONTEXT);
  ENEMY.update(CONTEXT, CANVAS, GRAVITY, PLAYER);
  HEALT_BAR_ENEMY.update(ENEMY.life_display/100);
  HEALT_BAR_ENEMY.draw(CONTEXT);

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
