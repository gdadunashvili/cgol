import { Player} from './sprite';
import { ControleKeys, entity_controller } from './entity_controller';
import { FillBar } from './status_bar';
import { draw_text } from './text_drawing';
import { DIRECTION } from './utils';

const CANVAS = document.querySelector('canvas')!;
let CONTEXT = CANVAS.getContext('2d')!;

CONTEXT.fillRect(0,  0, CANVAS.width, CANVAS.height);
const GRAVITY: number = 0.7;
const HEALTH_WIDTH = 300;
const HEALTH_HEIGHT = 9;


class GameState{
    players: [Player, Player];
    healt_bar_players: [FillBar, FillBar];

    private constructor(){
        this.players = [new Player(1, {x: 1  , y: 0 }, {x: 0, y: 0}, DIRECTION.RIGHT, 'green'),
                        new Player(2, {x: 500, y: 10}, {x: 0, y: 0}, DIRECTION.LEFT , 'blue')];
        this.healt_bar_players = [ new FillBar({pos:{x:10, y:10}, 
                                               size:{width: HEALTH_WIDTH, height: HEALTH_HEIGHT}
                                              },
                                              1, DIRECTION.RIGHT),
                                   new FillBar({pos:{x:CANVAS.width - HEALTH_WIDTH - 10, y:10}, 
                                               size:{width: HEALTH_WIDTH, height: HEALTH_HEIGHT}
                                              },
                                              1, DIRECTION.LEFT)];
    }

    static Initiate(): GameState { return new GameState(); }

    update_player(id: number){
        let other = 0;
        if(id==0){other = 1}
        else if(id==1){other = 0}
        else{ 
            console.log(`Wrong Player Id ${id} was provided`);
            process.exit(1);
        }
        
        this.players[id].update(CONTEXT, CANVAS, GRAVITY, this.players[other]);
        this.healt_bar_players[id].update(this.players[id].life_display/100);
        this.healt_bar_players[id].draw(CONTEXT);

        entity_controller(this.players[id], this.players[other], CANVAS, KEYS, CONTROLLER_KEYS[id])
    }

}

let KEYS: {[key: string]: boolean} = {};
let PLAYER_0_CONTROLLER_KEYS: ControleKeys = {left:'a', right:'d', up:'w', down:'s', attack:'c'};
let PLAYER_1_CONTROLLER_KEYS = {left:'ArrowLeft', right:'ArrowRight', up:'ArrowUp', down:'ArrowDown', attack:','};

let CONTROLLER_KEYS = [ 
    PLAYER_0_CONTROLLER_KEYS,
    PLAYER_1_CONTROLLER_KEYS
]

let GAME_OVER = false;

function game_over_check(player: Player, other_player_name: string){

    let game_over = player.life<=0;
    if(game_over){
        draw_text(`Game Over! ${other_player_name} won!`, {x:CANVAS.width/2, y:CANVAS.height/2}, 50, 50, "white", CONTEXT);
    }
    return game_over;
}

let GS = GameState.Initiate();

function animate() {

    requestAnimationFrame(animate);


    GAME_OVER = GAME_OVER || game_over_check(GS.players[0], "Player 2");
    GAME_OVER = GAME_OVER || game_over_check(GS.players[1], "Player 1");

    if(!GAME_OVER){
        CONTEXT.fillStyle = 'black';
        CONTEXT.fillRect(0, 0, CANVAS.width, CANVAS.height);

        GS.update_player(0);
        GS.update_player(1);
    }
}


const restart_button = document.getElementById('restart_button');

restart_button?.addEventListener('click', () => {
    console.log(GAME_OVER);

    GAME_OVER = false;
    GS = GameState.Initiate();
    console.log(GAME_OVER);
})


window.addEventListener('keydown', (event) => {
    KEYS[event.key] = true 
    if(Object.values(PLAYER_0_CONTROLLER_KEYS).includes(event.key)){ GS.players[0].last_key = event.key; } 
    if(Object.values(PLAYER_1_CONTROLLER_KEYS).includes(event.key)){ GS.players[1].last_key = event.key; }
})

window.addEventListener('keyup', (event) => { KEYS[event.key] = false })


animate();
