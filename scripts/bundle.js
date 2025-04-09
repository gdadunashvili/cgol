/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/entity_controller.ts":
/*!**********************************!*\
  !*** ./src/entity_controller.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.entity_controller = entity_controller;
const sounds_1 = __webpack_require__(/*! ./sounds */ "./src/sounds.ts");
function bounce(entity, other_entity, overlap) {
    const pos = entity.bounding_box.pos;
    const other_pos = other_entity.bounding_box.pos;
    const s = other_pos.x - pos.x > 0 ? 1 : -1;
    other_pos.x += overlap * s * 0.7;
}
function knock_back(entity, other_entity, overlap) {
    const pos = entity.bounding_box.pos;
    const other_pos = other_entity.bounding_box.pos;
    const s = other_pos.x - pos.x > 0 ? 1 : -1;
    pos.x -= overlap * s * 0.3;
}
function collision_detector(entity, other_entity) {
    const pos = entity.pos;
    const other_pos = other_entity.pos;
    const size = entity.size;
    const other_size = other_entity.size;
    if (pos.x < other_pos.x + other_size.width &&
        pos.x + size.width > other_pos.x &&
        pos.y < other_pos.y + other_size.height &&
        pos.y + size.height > other_pos.y) {
        return size.width + other_size.width - Math.abs(pos.x - other_pos.x);
    }
    return 0;
}
function entity_controller(entity, other_entity, canvas, keys, controle_keys) {
    const speed = 5;
    const jump = 20;
    entity.vel.x = 0;
    if (keys[controle_keys.left] &&
        (entity.last_key === controle_keys.left
            || entity.last_key === controle_keys.up)) {
        entity.vel.x = -speed;
    }
    if (keys[controle_keys.right] &&
        (entity.last_key === controle_keys.right
            || entity.last_key === controle_keys.up)) {
        entity.vel.x = speed;
    }
    if (keys[controle_keys.up]) {
        if (entity.bounding_box.pos.y > canvas.height - 1.05 * entity.bounding_box.size.height) {
            entity.bounding_box.pos.y -= 1.1;
            entity.vel.y = -jump;
        }
        keys.w = false;
    }
    entity.is_atacking = false;
    if (keys[controle_keys.attack]) {
        entity.is_atacking = true;
        let overlap = collision_detector(entity.attack_box, other_entity.bounding_box);
        if (overlap > 0) {
            (0, sounds_1.play_hit_sound)();
            bounce(entity, other_entity, overlap);
            knock_back(entity, other_entity, overlap);
            other_entity.life -= entity.base_damage;
        }
    }
    if (keys[controle_keys.down]) {
        entity.bounding_box.size.height = entity.duck_height;
    }
    else {
        entity.bounding_box.size.height = entity.standup_height;
    }
}


/***/ }),

/***/ "./src/sounds.ts":
/*!***********************!*\
  !*** ./src/sounds.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.play_hit_sound = play_hit_sound;
const HIT_SOUND = new Audio('../assets/sound/hit.mp3');
function play_hit_sound() {
    HIT_SOUND.play();
}


/***/ }),

/***/ "./src/sprite.ts":
/*!***********************!*\
  !*** ./src/sprite.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Player = void 0;
const utils_1 = __webpack_require__(/*! ./utils */ "./src/utils.ts");
class Player {
    offset_attac_box() {
        let x_offset;
        switch (this.direction) {
            case utils_1.DIRECTION.LEFT:
                x_offset = -this.attack_box.size.width;
                break;
            case utils_1.DIRECTION.RIGHT:
                x_offset = this.bounding_box.size.width;
                break;
        }
        this.attack_box.pos.x = this.bounding_box.pos.x + x_offset;
        this.attack_box.pos.y = this.bounding_box.pos.y;
    }
    constructor(id, pos, vel, direction, style) {
        this.id = id;
        this.vel = vel;
        const height = 150;
        this.bounding_box = { pos: pos, size: { width: 50, height: height } };
        this.direction = direction;
        this.standup_height = height;
        this.duck_height = height * 0.6;
        this.style = style;
        this.attack_box = {
            pos: { x: 0, y: 0 },
            size: { width: 100, height: 50 }
        };
        this.offset_attac_box();
        this.life = 30;
        this.base_damage = 1;
    }
    draw(c) {
        c.fillStyle = this.style;
        c.fillRect(this.bounding_box.pos.x, this.bounding_box.pos.y, this.bounding_box.size.width, this.bounding_box.size.height);
        if (this.is_atacking) {
            c.fillStyle = 'red';
            // if(KeyboardEvent.
            c.fillRect(this.attack_box.pos.x, this.attack_box.pos.y, this.attack_box.size.width, this.attack_box.size.height);
        }
    }
    update(c, canvas, gravity, other) {
        this.draw(c);
        this.offset_attac_box();
        let diff = other.bounding_box.pos.x - this.bounding_box.pos.x;
        if (diff > 0) {
            this.direction = utils_1.DIRECTION.RIGHT;
        }
        ;
        if (diff < 0) {
            this.direction = utils_1.DIRECTION.LEFT;
        }
        ;
        if (this.bounding_box.pos.y + this.bounding_box.size.height >= canvas.height) {
            this.vel.y = 0;
            this.bounding_box.pos.y -=
                this.bounding_box.pos.y + this.bounding_box.size.height - canvas.height;
        }
        else {
            this.vel.y += gravity;
        }
        if (this.bounding_box.pos.x <= 0) {
            this.bounding_box.pos.x = 1;
        }
        if (this.bounding_box.pos.x + this.bounding_box.size.width >= canvas.width) {
            this.bounding_box.pos.x = canvas.width - this.bounding_box.size.width - 1;
        }
        this.bounding_box.pos.x += this.vel.x;
        this.bounding_box.pos.y += this.vel.y;
        this.life_display = Math.max(this.life, 0);
        let life_text = document.getElementById(`health${this.id}`);
        life_text.innerHTML = `health P1: ${this.life_display}`;
    }
}
exports.Player = Player;


/***/ }),

/***/ "./src/status_bar.ts":
/*!***************************!*\
  !*** ./src/status_bar.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FillBar = void 0;
const utils_1 = __webpack_require__(/*! ./utils */ "./src/utils.ts");
class FillBar {
    constructor(box, fill_fraction, fill_dir) {
        this.box = box;
        this.fill_fraction = fill_fraction;
        this.fill_dir = fill_dir;
    }
    update(new_fill_fraction) {
        this.fill_fraction = new_fill_fraction;
        if (this.fill_fraction > 0.8) {
            this.color = 'green';
        }
        else if (this.fill_fraction > 0.7) {
            this.color = 'lightgreen';
        }
        else if (this.fill_fraction > 0.6) {
            this.color = 'yellow';
        }
        else if (this.fill_fraction > 0.3) {
            this.color = 'orange';
        }
        else {
            this.color = 'red';
        }
    }
    draw(c) {
        c.fillStyle = this.color;
        c.strokeStyle = this.color;
        let w = this.fill_fraction;
        c.beginPath();
        c.rect(this.box.pos.x, this.box.pos.y, this.box.size.width, this.box.size.height);
        c.stroke();
        switch (this.fill_dir) {
            case utils_1.DIRECTION.RIGHT:
                c.fillRect(this.box.pos.x, this.box.pos.y, w * this.box.size.width, this.box.size.height);
                break;
            case utils_1.DIRECTION.LEFT:
                c.fillRect(this.box.pos.x + (1 - w) * this.box.size.width, this.box.pos.y, w * this.box.size.width, this.box.size.height);
                break;
        }
    }
}
exports.FillBar = FillBar;


/***/ }),

/***/ "./src/text_drawing.ts":
/*!*****************************!*\
  !*** ./src/text_drawing.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.draw_text = draw_text;
function draw_text(text, top_left_corner, width, height, color, context) {
    // Calculate font size based on the height of the rectangle
    // This can be tuned to better fit the width if needed
    const fontSize = Math.min(width, height) * 0.8;
    context.font = `${fontSize}px sans-serif`;
    context.textBaseline = 'top';
    context.textAlign = 'left';
    // Optional: clear the rectangle before drawing
    // context.clearRect(top_left_corner.x, top_left_corner.y, width, height);
    // Measure text to center it inside the box
    const textMetrics = context.measureText(text);
    const textWidth = textMetrics.width;
    const textHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;
    const offsetX = (width - textWidth) / 2;
    const offsetY = (height - textHeight) / 2;
    let old_fill = context.fillStyle;
    context.fillStyle = color; // Or any color you prefer
    context.fillText(text, top_left_corner.x + offsetX, top_left_corner.y + offsetY);
    context.fillStyle = old_fill;
}


/***/ }),

/***/ "./src/utils.ts":
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DIRECTION = exports.vec2d = void 0;
class vec2d {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
exports.vec2d = vec2d;
var DIRECTION;
(function (DIRECTION) {
    DIRECTION[DIRECTION["LEFT"] = -1] = "LEFT";
    DIRECTION[DIRECTION["RIGHT"] = 1] = "RIGHT";
})(DIRECTION || (exports.DIRECTION = DIRECTION = {}));
;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const sprite_1 = __webpack_require__(/*! ./sprite */ "./src/sprite.ts");
const entity_controller_1 = __webpack_require__(/*! ./entity_controller */ "./src/entity_controller.ts");
const status_bar_1 = __webpack_require__(/*! ./status_bar */ "./src/status_bar.ts");
const text_drawing_1 = __webpack_require__(/*! ./text_drawing */ "./src/text_drawing.ts");
const utils_1 = __webpack_require__(/*! ./utils */ "./src/utils.ts");
const CANVAS = document.querySelector('canvas');
let CONTEXT = CANVAS.getContext('2d');
CONTEXT.fillRect(0, 0, CANVAS.width, CANVAS.height);
const GRAVITY = 0.7;
const HEALTH_WIDTH = 300;
const HEALTH_HEIGHT = 9;
class GameState {
    constructor() {
        this.players = [new sprite_1.Player(1, { x: 1, y: 0 }, { x: 0, y: 0 }, utils_1.DIRECTION.RIGHT, 'green'),
            new sprite_1.Player(2, { x: 500, y: 10 }, { x: 0, y: 0 }, utils_1.DIRECTION.LEFT, 'blue')];
        this.healt_bar_players = [new status_bar_1.FillBar({ pos: { x: 10, y: 10 },
                size: { width: HEALTH_WIDTH, height: HEALTH_HEIGHT }
            }, 1, utils_1.DIRECTION.RIGHT),
            new status_bar_1.FillBar({ pos: { x: CANVAS.width - HEALTH_WIDTH - 10, y: 10 },
                size: { width: HEALTH_WIDTH, height: HEALTH_HEIGHT }
            }, 1, utils_1.DIRECTION.LEFT)];
    }
    static Initiate() { return new GameState(); }
    update_player(id) {
        let other = 0;
        if (id == 0) {
            other = 1;
        }
        else if (id == 1) {
            other = 0;
        }
        else {
            console.log(`Wrong Player Id ${id} was provided`);
            process.exit(1);
        }
        this.players[id].update(CONTEXT, CANVAS, GRAVITY, this.players[other]);
        this.healt_bar_players[id].update(this.players[id].life_display / 100);
        this.healt_bar_players[id].draw(CONTEXT);
        (0, entity_controller_1.entity_controller)(this.players[id], this.players[other], CANVAS, KEYS, CONTROLLER_KEYS[id]);
    }
}
let KEYS = {};
let PLAYER_0_CONTROLLER_KEYS = { left: 'a', right: 'd', up: 'w', down: 's', attack: 'c' };
let PLAYER_1_CONTROLLER_KEYS = { left: 'ArrowLeft', right: 'ArrowRight', up: 'ArrowUp', down: 'ArrowDown', attack: ',' };
let CONTROLLER_KEYS = [
    PLAYER_0_CONTROLLER_KEYS,
    PLAYER_1_CONTROLLER_KEYS
];
let GAME_OVER = false;
function game_over_check(player, other_player_name) {
    let game_over = player.life <= 0;
    if (game_over) {
        (0, text_drawing_1.draw_text)(`Game Over! ${other_player_name} won!`, { x: CANVAS.width / 2, y: CANVAS.height / 2 }, 50, 50, "white", CONTEXT);
    }
    return game_over;
}
let GS = GameState.Initiate();
function animate() {
    requestAnimationFrame(animate);
    GAME_OVER = GAME_OVER || game_over_check(GS.players[0], "Player 2");
    GAME_OVER = GAME_OVER || game_over_check(GS.players[1], "Player 1");
    if (!GAME_OVER) {
        CONTEXT.fillStyle = 'black';
        CONTEXT.fillRect(0, 0, CANVAS.width, CANVAS.height);
        GS.update_player(0);
        GS.update_player(1);
    }
}
const restart_button = document.getElementById('restart_button');
restart_button === null || restart_button === void 0 ? void 0 : restart_button.addEventListener('click', () => {
    console.log(GAME_OVER);
    GAME_OVER = false;
    GS = GameState.Initiate();
    console.log(GAME_OVER);
});
window.addEventListener('keydown', (event) => {
    KEYS[event.key] = true;
    if (Object.values(PLAYER_0_CONTROLLER_KEYS).includes(event.key)) {
        GS.players[0].last_key = event.key;
    }
    if (Object.values(PLAYER_1_CONTROLLER_KEYS).includes(event.key)) {
        GS.players[1].last_key = event.key;
    }
});
window.addEventListener('keyup', (event) => { KEYS[event.key] = false; });
animate();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RyxDQUFDLENBQUM7WUFDZixJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNyQixJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDNUUsQ0FBQzthQUFLLENBQUM7WUFDTCxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxPQUFPLENBQUM7UUFDeEIsQ0FBQztRQUNELElBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1lBQ2hDLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDOUIsQ0FBQztRQUNELElBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFDLENBQUM7WUFDdkUsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztRQUM1RSxDQUFDO1FBQ0QsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUV0QyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7UUFDMUMsSUFBSSxTQUFTLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxTQUFTLElBQUksQ0FBQyxFQUFFLEVB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bnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NvdW5kcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc3ByaXRlLnRzIiwid2VicGFjazovLy8uL3NyYy9zdGF0dXNfYmFyLnRzIiwid2VicGFjazovLy8uL3NyYy90ZXh0X2RyYXdpbmcudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzLnRzIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBwbGF5X2hpdF9zb3VuZCB9IGZyb20gXCIuL3NvdW5kc1wiO1xuaW1wb3J0IHsgUGxheWVyIH0gZnJvbSBcIi4vc3ByaXRlXCI7XG5pbXBvcnQgeyBCb3ggfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5leHBvcnQgdHlwZSBDb250cm9sZUtleXMgPSB7XG4gIGxlZnQ6IHN0cmluZywgXG4gIHJpZ2h0OiBzdHJpbmcsIFxuICB1cDogc3RyaW5nLCBcbiAgZG93bjogc3RyaW5nLCBcbiAgYXR0YWNrOiBzdHJpbmdcbn1cblxuZnVuY3Rpb24gYm91bmNlKGVudGl0eTogUGxheWVyLCBvdGhlcl9lbnRpdHk6IFBsYXllciwgb3ZlcmxhcDogbnVtYmVyKSB7XG4gIGNvbnN0IHBvcyA9IGVudGl0eS5ib3VuZGluZ19ib3gucG9zO1xuICBjb25zdCBvdGhlcl9wb3MgPSBvdGhlcl9lbnRpdHkuYm91bmRpbmdfYm94LnBvcztcblxuICBjb25zdCBzID0gb3RoZXJfcG9zLnggIC0gcG9zLnggPiAwID8gMSA6IC0xO1xuICBvdGhlcl9wb3MueCArPSBvdmVybGFwICogcyowLjc7XG59XG5mdW5jdGlvbiBrbm9ja19iYWNrKGVudGl0eTogUGxheWVyLCBvdGhlcl9lbnRpdHk6IFBsYXllciwgb3ZlcmxhcDogbnVtYmVyKSB7XG4gIGNvbnN0IHBvcyA9IGVudGl0eS5ib3VuZGluZ19ib3gucG9zO1xuICBjb25zdCBvdGhlcl9wb3MgPSBvdGhlcl9lbnRpdHkuYm91bmRpbmdfYm94LnBvcztcblxuICBjb25zdCBzID0gb3RoZXJfcG9zLnggIC0gcG9zLnggPiAwID8gMSA6IC0xO1xuICBwb3MueCAtPSBvdmVybGFwICogcyowLjM7XG59XG5cbmZ1bmN0aW9uIGNvbGxpc2lvbl9kZXRlY3RvcihlbnRpdHk6IEJveCwgb3RoZXJfZW50aXR5OiBCb3gpOiBudW1iZXIge1xuICBjb25zdCBwb3MgPSBlbnRpdHkucG9zO1xuICBjb25zdCBvdGhlcl9wb3MgPSBvdGhlcl9lbnRpdHkucG9zO1xuICBjb25zdCBzaXplID0gZW50aXR5LnNpemU7XG4gIGNvbnN0IG90aGVyX3NpemUgPSBvdGhlcl9lbnRpdHkuc2l6ZTtcblxuICBpZiAocG9zLnggPCBvdGhlcl9wb3MueCArIG90aGVyX3NpemUud2lkdGggJiZcbiAgICAgIHBvcy54ICsgc2l6ZS53aWR0aCA+IG90aGVyX3Bvcy54ICYmXG4gICAgICBwb3MueSA8IG90aGVyX3Bvcy55ICsgb3RoZXJfc2l6ZS5oZWlnaHQgJiZcbiAgICAgIHBvcy55ICsgc2l6ZS5oZWlnaHQgPiBvdGhlcl9wb3MueSl7XG4gICAgcmV0dXJuIHNpemUud2lkdGggKyBvdGhlcl9zaXplLndpZHRoIC0gTWF0aC5hYnMocG9zLnggLSBvdGhlcl9wb3MueCk7XG4gIH1cblxuICByZXR1cm4gMDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVudGl0eV9jb250cm9sbGVyKGVudGl0eTogUGxheWVyLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgb3RoZXJfZW50aXR5OiBQbGF5ZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGtleXM6IHsgW2tleTogc3RyaW5nXTogYm9vbGVhbiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sZV9rZXlzOiBDb250cm9sZUtleXMpe1xuXG4gIGNvbnN0IHNwZWVkID0gNTtcbiAgY29uc3QganVtcCA9IDIwO1xuICBlbnRpdHkudmVsLnggPSAwOyBcbiAgaWYoa2V5c1tjb250cm9sZV9rZXlzLmxlZnRdICYmIFxuICAgICAoZW50aXR5Lmxhc3Rfa2V5ID09PSBjb250cm9sZV9rZXlzLmxlZnQgXG4gICAgICAgfHwgZW50aXR5Lmxhc3Rfa2V5ID09PSBjb250cm9sZV9rZXlzLnVwKSBcbiAgICApIHsgXG4gICAgICBlbnRpdHkudmVsLnggPSAtc3BlZWQ7IFxuICAgIH1cblxuICBpZihrZXlzW2NvbnRyb2xlX2tleXMucmlnaHRdICYmIFxuICAgICAoZW50aXR5Lmxhc3Rfa2V5ID09PSBjb250cm9sZV9rZXlzLnJpZ2h0XG4gICAgICAgfHwgZW50aXR5Lmxhc3Rfa2V5ID09PSBjb250cm9sZV9rZXlzLnVwKSBcbiAgICAgKSB7IFxuICAgICAgIGVudGl0eS52ZWwueCA9IHNwZWVkOyBcbiAgICAgfVxuXG4gIGlmKGtleXNbY29udHJvbGVfa2V5cy51cF0peyBcbiAgICBpZihlbnRpdHkuYm91bmRpbmdfYm94LnBvcy55ID4gY2FudmFzLmhlaWdodCAtIDEuMDUqZW50aXR5LmJvdW5kaW5nX2JveC5zaXplLmhlaWdodCl7XG4gICAgICBlbnRpdHkuYm91bmRpbmdfYm94LnBvcy55IC09IDEuMTtcbiAgICAgIGVudGl0eS52ZWwueSA9IC1qdW1wOyBcbiAgICB9XG4gICAga2V5cy53ID0gZmFsc2VcbiAgfVxuXG4gIGVudGl0eS5pc19hdGFja2luZyA9IGZhbHNlO1xuICBpZihrZXlzW2NvbnRyb2xlX2tleXMuYXR0YWNrXSl7XG4gICAgZW50aXR5LmlzX2F0YWNraW5nID0gdHJ1ZTtcbiAgICBsZXQgb3ZlcmxhcDogbnVtYmVyID0gY29sbGlzaW9uX2RldGVjdG9yKGVudGl0eS5hdHRhY2tfYm94LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3RoZXJfZW50aXR5LmJvdW5kaW5nX2JveCk7XG4gICAgaWYgKG92ZXJsYXA+MCl7XG4gICAgICBwbGF5X2hpdF9zb3VuZCgpO1xuICAgICAgYm91bmNlKGVudGl0eSwgb3RoZXJfZW50aXR5LCBvdmVybGFwKTtcbiAgICAgIGtub2NrX2JhY2soZW50aXR5LCBvdGhlcl9lbnRpdHksIG92ZXJsYXApO1xuXG4gICAgICBvdGhlcl9lbnRpdHkubGlmZSAtPSBlbnRpdHkuYmFzZV9kYW1hZ2U7XG4gICAgfVxuICB9XG5cbiAgaWYoa2V5c1tjb250cm9sZV9rZXlzLmRvd25dKXsgXG4gICAgZW50aXR5LmJvdW5kaW5nX2JveC5zaXplLmhlaWdodCA9IGVudGl0eS5kdWNrX2hlaWdodDtcbiAgfVxuICBlbHNleyBcbiAgICBlbnRpdHkuYm91bmRpbmdfYm94LnNpemUuaGVpZ2h0ID0gZW50aXR5LnN0YW5kdXBfaGVpZ2h0O1xuICB9XG59XG5cbiIsImNvbnN0IEhJVF9TT1VORCA9ICBuZXcgQXVkaW8oJy4uL2Fzc2V0cy9zb3VuZC9oaXQubXAzJylcblxuZXhwb3J0IGZ1bmN0aW9uIHBsYXlfaGl0X3NvdW5kKCl7XG4gIEhJVF9TT1VORC5wbGF5KCk7XG59XG4iLCJpbXBvcnQgeyB2ZWMyZCwgQm94LCBESVJFQ1RJT04gfSBmcm9tICcuL3V0aWxzJztcblxuZXhwb3J0IGNsYXNzIFBsYXllciB7XG5cbiAgYm91bmRpbmdfYm94OiBCb3g7XG4gIGF0dGFja19ib3g6IEJveDtcblxuICBpZDogbnVtYmVyO1xuICB2ZWw6IHZlYzJkO1xuICBkaXJlY3Rpb246IERJUkVDVElPTjtcbiAgc3RhbmR1cF9oZWlnaHQ6IG51bWJlcjtcbiAgZHVja19oZWlnaHQ6IG51bWJlcjtcbiAgc3R5bGU6IHN0cmluZztcbiAgbGFzdF9rZXk6IHN0cmluZztcbiAgaXNfYXRhY2tpbmc6IGJvb2xlYW47XG4gIGxpZmU6IG51bWJlcjtcbiAgbGlmZV9kaXNwbGF5OiBudW1iZXI7XG4gIGJhc2VfZGFtYWdlOiBudW1iZXI7XG5cbiAgcHJpdmF0ZSBvZmZzZXRfYXR0YWNfYm94KCl7XG4gICAgbGV0IHhfb2Zmc2V0Om51bWJlcjtcbiAgICBzd2l0Y2godGhpcy5kaXJlY3Rpb24pe1xuICAgICAgY2FzZSBESVJFQ1RJT04uTEVGVDogXG4gICAgICAgIHhfb2Zmc2V0ID0gLXRoaXMuYXR0YWNrX2JveC5zaXplLndpZHRoO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgRElSRUNUSU9OLlJJR0hUOlxuICAgICAgICB4X29mZnNldCA9IHRoaXMuYm91bmRpbmdfYm94LnNpemUud2lkdGg7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHRoaXMuYXR0YWNrX2JveC5wb3MueCA9IHRoaXMuYm91bmRpbmdfYm94LnBvcy54ICsgeF9vZmZzZXQ7XG4gICAgdGhpcy5hdHRhY2tfYm94LnBvcy55ID0gdGhpcy5ib3VuZGluZ19ib3gucG9zLnk7XG5cbiAgfVxuXG4gIGNvbnN0cnVjdG9yKGlkOiBudW1iZXIsIHBvczogdmVjMmQsIHZlbDogdmVjMmQsIGRpcmVjdGlvbjogRElSRUNUSU9OLCBzdHlsZTogc3RyaW5nKSB7XG4gICAgdGhpcy5pZCA9IGlkO1xuICAgIHRoaXMudmVsID0gdmVsO1xuICAgIGNvbnN0IGhlaWdodDogbnVtYmVyID0gMTUwO1xuICAgIHRoaXMuYm91bmRpbmdfYm94ID0geyBwb3M6IHBvcywgc2l6ZToge3dpZHRoOiA1MCwgaGVpZ2h0OiBoZWlnaHR9IH07XG4gICAgdGhpcy5kaXJlY3Rpb24gPSBkaXJlY3Rpb247IFxuXG4gICAgdGhpcy5zdGFuZHVwX2hlaWdodCA9IGhlaWdodDtcbiAgICB0aGlzLmR1Y2tfaGVpZ2h0ID0gaGVpZ2h0KjAuNjtcblxuICAgIHRoaXMuc3R5bGUgPSBzdHlsZTtcblxuXG4gICAgdGhpcy5hdHRhY2tfYm94ID0ge1xuICAgICAgcG9zOiB7eDogMCwgeTowfSxcbiAgICAgIHNpemU6IHt3aWR0aDogMTAwLCBoZWlnaHQ6IDUwfVxuICAgIH1cblxuICAgIHRoaXMub2Zmc2V0X2F0dGFjX2JveCgpO1xuXG4gICAgdGhpcy5saWZlID0gMzA7XG4gICAgdGhpcy5iYXNlX2RhbWFnZSA9IDE7XG5cbiAgfVxuIFxuICBkcmF3KGM6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCkge1xuICAgIGMuZmlsbFN0eWxlID0gdGhpcy5zdHlsZTtcbiAgICBjLmZpbGxSZWN0KHRoaXMuYm91bmRpbmdfYm94LnBvcy54LCB0aGlzLmJvdW5kaW5nX2JveC5wb3MueSwgXG4gICAgICAgICAgICAgICB0aGlzLmJvdW5kaW5nX2JveC5zaXplLndpZHRoLCB0aGlzLmJvdW5kaW5nX2JveC5zaXplLmhlaWdodCk7XG5cbiAgICBpZih0aGlzLmlzX2F0YWNraW5nKXtcbiAgICAgIGMuZmlsbFN0eWxlID0gJ3JlZCc7XG5cbiAgICAgIC8vIGlmKEtleWJvYXJkRXZlbnQuXG4gICAgICBjLmZpbGxSZWN0KHRoaXMuYXR0YWNrX2JveC5wb3MueCwgdGhpcy5hdHRhY2tfYm94LnBvcy55LCBcbiAgICAgICAgICAgICAgICAgdGhpcy5hdHRhY2tfYm94LnNpemUud2lkdGgsXG4gICAgICAgICAgICAgICAgIHRoaXMuYXR0YWNrX2JveC5zaXplLmhlaWdodCk7XG4gICAgfVxuXG4gIH1cblxuICB1cGRhdGUoYzogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELFxuICAgICAgICAgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCwgXG4gICAgICAgICBncmF2aXR5OiBudW1iZXIsIG90aGVyOiBQbGF5ZXIpIHtcbiAgICB0aGlzLmRyYXcoYyk7XG5cbiAgICB0aGlzLm9mZnNldF9hdHRhY19ib3goKTtcbiAgICBsZXQgZGlmZjogbnVtYmVyID0gb3RoZXIuYm91bmRpbmdfYm94LnBvcy54IC0gdGhpcy5ib3VuZGluZ19ib3gucG9zLng7XG4gICAgaWYoZGlmZiA+IDApeyB0aGlzLmRpcmVjdGlvbiA9IERJUkVDVElPTi5SSUdIVCB9O1xuICAgIGlmKGRpZmYgPCAwKXsgdGhpcy5kaXJlY3Rpb24gPSBESVJFQ1RJT04uTEVGVCB9O1xuXG4gICAgaWYodGhpcy5ib3VuZGluZ19ib3gucG9zLnkrdGhpcy5ib3VuZGluZ19ib3guc2l6ZS5oZWlnaHQgPj0gY2FudmFzLmhlaWdodCl7XG4gICAgICB0aGlzLnZlbC55ID0gMDtcbiAgICAgIHRoaXMuYm91bmRpbmdfYm94LnBvcy55IC09IFxuICAgICAgICB0aGlzLmJvdW5kaW5nX2JveC5wb3MueSArIHRoaXMuYm91bmRpbmdfYm94LnNpemUuaGVpZ2h0IC0gY2FudmFzLmhlaWdodDsgXG4gICAgfSBlbHNle1xuICAgICAgdGhpcy52ZWwueSArPSBncmF2aXR5O1xuICAgIH1cbiAgICBpZih0aGlzLmJvdW5kaW5nX2JveC5wb3MueCA8PSAwICl7XG4gICAgICB0aGlzLmJvdW5kaW5nX2JveC5wb3MueCA9IDE7XG4gICAgfVxuICAgIGlmKHRoaXMuYm91bmRpbmdfYm94LnBvcy54K3RoaXMuYm91bmRpbmdfYm94LnNpemUud2lkdGggPj0gY2FudmFzLndpZHRoKXtcbiAgICAgIHRoaXMuYm91bmRpbmdfYm94LnBvcy54ID0gY2FudmFzLndpZHRoIC0gdGhpcy5ib3VuZGluZ19ib3guc2l6ZS53aWR0aCAtIDE7IFxuICAgIH1cbiAgICB0aGlzLmJvdW5kaW5nX2JveC5wb3MueCArPSB0aGlzLnZlbC54O1xuICAgIHRoaXMuYm91bmRpbmdfYm94LnBvcy55ICs9IHRoaXMudmVsLnk7XG5cbiAgICB0aGlzLmxpZmVfZGlzcGxheSA9IE1hdGgubWF4KHRoaXMubGlmZSwgMClcbiAgICBsZXQgbGlmZV90ZXh0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYGhlYWx0aCR7dGhpcy5pZH1gKSE7XG4gICAgbGlmZV90ZXh0LmlubmVySFRNTCA9ICBgaGVhbHRoIFAxOiAke3RoaXMubGlmZV9kaXNwbGF5fWA7IFxuICAgIFxuICB9XG59XG4iLCJpbXBvcnQgeyBESVJFQ1RJT04sIEJveCB9IGZyb20gJy4vdXRpbHMnO1xuXG5leHBvcnQgY2xhc3MgRmlsbEJhciB7XG4gIGJveDogQm94XG4gIGNvbG9yOiBzdHJpbmc7XG4gIGZpbGxfZnJhY3Rpb246IG51bWJlcjtcbiAgZmlsbF9kaXI6IERJUkVDVElPTjtcblxuICBjb25zdHJ1Y3Rvcihib3g6IEJveCwgZmlsbF9mcmFjdGlvbjogbnVtYmVyLCBmaWxsX2RpcjogRElSRUNUSU9OKXtcblxuICAgIHRoaXMuYm94ID0gYm94O1xuICAgIHRoaXMuZmlsbF9mcmFjdGlvbiA9IGZpbGxfZnJhY3Rpb247XG4gICAgdGhpcy5maWxsX2RpciA9IGZpbGxfZGlyO1xuICB9XG5cbiAgdXBkYXRlKG5ld19maWxsX2ZyYWN0aW9uOiBudW1iZXIpeyBcbiAgICB0aGlzLmZpbGxfZnJhY3Rpb24gPSBuZXdfZmlsbF9mcmFjdGlvbjsgXG4gICAgaWYodGhpcy5maWxsX2ZyYWN0aW9uID4gMC44KXsgdGhpcy5jb2xvciA9ICdncmVlbicgfVxuICAgIGVsc2UgaWYodGhpcy5maWxsX2ZyYWN0aW9uID4gMC43KXsgdGhpcy5jb2xvciA9ICdsaWdodGdyZWVuJyB9XG4gICAgZWxzZSBpZih0aGlzLmZpbGxfZnJhY3Rpb24gPiAwLjYpIHt0aGlzLmNvbG9yID0gJ3llbGxvdyd9XG4gICAgZWxzZSBpZih0aGlzLmZpbGxfZnJhY3Rpb24gPiAwLjMpIHt0aGlzLmNvbG9yID0gJ29yYW5nZSd9XG4gICAgZWxzZSB7dGhpcy5jb2xvciA9ICdyZWQnfVxuXG4gIH1cbiAgZHJhdyhjOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpIHtcbiAgICBjLmZpbGxTdHlsZSA9IHRoaXMuY29sb3I7XG4gICAgYy5zdHJva2VTdHlsZSA9IHRoaXMuY29sb3I7XG4gICAgbGV0IHc6IG51bWJlciA9IHRoaXMuZmlsbF9mcmFjdGlvbjtcbiAgICBjLmJlZ2luUGF0aCgpO1xuICAgIGMucmVjdCh0aGlzLmJveC5wb3MueCwgdGhpcy5ib3gucG9zLnksIHRoaXMuYm94LnNpemUud2lkdGgsIHRoaXMuYm94LnNpemUuaGVpZ2h0KTtcbiAgICBjLnN0cm9rZSgpO1xuXG4gICAgc3dpdGNoKHRoaXMuZmlsbF9kaXIpe1xuICAgICAgY2FzZSBESVJFQ1RJT04uUklHSFQ6XG4gICAgICAgIGMuZmlsbFJlY3QodGhpcy5ib3gucG9zLngsIHRoaXMuYm94LnBvcy55LCB3KnRoaXMuYm94LnNpemUud2lkdGgsIHRoaXMuYm94LnNpemUuaGVpZ2h0KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIERJUkVDVElPTi5MRUZUOlxuICAgICAgICBjLmZpbGxSZWN0KHRoaXMuYm94LnBvcy54KygxLXcpKnRoaXMuYm94LnNpemUud2lkdGgsIHRoaXMuYm94LnBvcy55LCB3KnRoaXMuYm94LnNpemUud2lkdGgsIHRoaXMuYm94LnNpemUuaGVpZ2h0KTtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICB9XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gZHJhd190ZXh0KFxuICB0ZXh0OiBzdHJpbmcsXG4gIHRvcF9sZWZ0X2Nvcm5lcjogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9LFxuICB3aWR0aDogbnVtYmVyLFxuICBoZWlnaHQ6IG51bWJlcixcbiAgY29sb3I6IHN0cmluZyxcbiAgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIFxuKTogdm9pZCB7XG5cbiAgLy8gQ2FsY3VsYXRlIGZvbnQgc2l6ZSBiYXNlZCBvbiB0aGUgaGVpZ2h0IG9mIHRoZSByZWN0YW5nbGVcbiAgLy8gVGhpcyBjYW4gYmUgdHVuZWQgdG8gYmV0dGVyIGZpdCB0aGUgd2lkdGggaWYgbmVlZGVkXG4gIGNvbnN0IGZvbnRTaXplID0gTWF0aC5taW4od2lkdGgsIGhlaWdodCkgKiAwLjg7XG4gIGNvbnRleHQuZm9udCA9IGAke2ZvbnRTaXplfXB4IHNhbnMtc2VyaWZgO1xuICBjb250ZXh0LnRleHRCYXNlbGluZSA9ICd0b3AnO1xuICBjb250ZXh0LnRleHRBbGlnbiA9ICdsZWZ0JztcblxuICAvLyBPcHRpb25hbDogY2xlYXIgdGhlIHJlY3RhbmdsZSBiZWZvcmUgZHJhd2luZ1xuICAvLyBjb250ZXh0LmNsZWFyUmVjdCh0b3BfbGVmdF9jb3JuZXIueCwgdG9wX2xlZnRfY29ybmVyLnksIHdpZHRoLCBoZWlnaHQpO1xuXG4gIC8vIE1lYXN1cmUgdGV4dCB0byBjZW50ZXIgaXQgaW5zaWRlIHRoZSBib3hcbiAgY29uc3QgdGV4dE1ldHJpY3MgPSBjb250ZXh0Lm1lYXN1cmVUZXh0KHRleHQpO1xuICBjb25zdCB0ZXh0V2lkdGggPSB0ZXh0TWV0cmljcy53aWR0aDtcbiAgY29uc3QgdGV4dEhlaWdodCA9IHRleHRNZXRyaWNzLmFjdHVhbEJvdW5kaW5nQm94QXNjZW50ICsgdGV4dE1ldHJpY3MuYWN0dWFsQm91bmRpbmdCb3hEZXNjZW50O1xuXG4gIGNvbnN0IG9mZnNldFggPSAod2lkdGggLSB0ZXh0V2lkdGgpIC8gMjtcbiAgY29uc3Qgb2Zmc2V0WSA9IChoZWlnaHQgLSB0ZXh0SGVpZ2h0KSAvIDI7XG5cbiAgbGV0IG9sZF9maWxsID0gY29udGV4dC5maWxsU3R5bGVcbiAgY29udGV4dC5maWxsU3R5bGUgPSBjb2xvcjsgLy8gT3IgYW55IGNvbG9yIHlvdSBwcmVmZXJcbiAgY29udGV4dC5maWxsVGV4dCh0ZXh0LCB0b3BfbGVmdF9jb3JuZXIueCArIG9mZnNldFgsIHRvcF9sZWZ0X2Nvcm5lci55ICsgb2Zmc2V0WSk7XG4gIGNvbnRleHQuZmlsbFN0eWxlID0gb2xkX2ZpbGwgXG59XG5cbiIsImV4cG9ydCBjbGFzcyB2ZWMyZCB7XG4gIHg6IG51bWJlcjtcbiAgeTogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XG4gICAgdGhpcy54ID0geDtcbiAgICB0aGlzLnkgPSB5O1xuICB9XG59XG5cbmV4cG9ydCBlbnVtIERJUkVDVElPTiB7TEVGVD0tMSwgUklHSFQ9MX07XG5cbmV4cG9ydCB0eXBlIEJveCA9IHtcbiAgcG9zOiB2ZWMyZCxcbiAgc2l6ZToge3dpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyfVxufVxuXG5cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJpbXBvcnQgeyBQbGF5ZXJ9IGZyb20gJy4vc3ByaXRlJztcbmltcG9ydCB7IENvbnRyb2xlS2V5cywgZW50aXR5X2NvbnRyb2xsZXIgfSBmcm9tICcuL2VudGl0eV9jb250cm9sbGVyJztcbmltcG9ydCB7IEZpbGxCYXIgfSBmcm9tICcuL3N0YXR1c19iYXInO1xuaW1wb3J0IHsgZHJhd190ZXh0IH0gZnJvbSAnLi90ZXh0X2RyYXdpbmcnO1xuaW1wb3J0IHsgRElSRUNUSU9OIH0gZnJvbSAnLi91dGlscyc7XG5cbmNvbnN0IENBTlZBUyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2NhbnZhcycpITtcbmxldCBDT05URVhUID0gQ0FOVkFTLmdldENvbnRleHQoJzJkJykhO1xuXG5DT05URVhULmZpbGxSZWN0KDAsICAwLCBDQU5WQVMud2lkdGgsIENBTlZBUy5oZWlnaHQpO1xuY29uc3QgR1JBVklUWTogbnVtYmVyID0gMC43O1xuY29uc3QgSEVBTFRIX1dJRFRIID0gMzAwO1xuY29uc3QgSEVBTFRIX0hFSUdIVCA9IDk7XG5cblxuY2xhc3MgR2FtZVN0YXRle1xuICAgIHBsYXllcnM6IFtQbGF5ZXIsIFBsYXllcl07XG4gICAgaGVhbHRfYmFyX3BsYXllcnM6IFtGaWxsQmFyLCBGaWxsQmFyXTtcblxuICAgIHByaXZhdGUgY29uc3RydWN0b3IoKXtcbiAgICAgICAgdGhpcy5wbGF5ZXJzID0gW25ldyBQbGF5ZXIoMSwge3g6IDEgICwgeTogMCB9LCB7eDogMCwgeTogMH0sIERJUkVDVElPTi5SSUdIVCwgJ2dyZWVuJyksXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgUGxheWVyKDIsIHt4OiA1MDAsIHk6IDEwfSwge3g6IDAsIHk6IDB9LCBESVJFQ1RJT04uTEVGVCAsICdibHVlJyldO1xuICAgICAgICB0aGlzLmhlYWx0X2Jhcl9wbGF5ZXJzID0gWyBuZXcgRmlsbEJhcih7cG9zOnt4OjEwLCB5OjEwfSwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpemU6e3dpZHRoOiBIRUFMVEhfV0lEVEgsIGhlaWdodDogSEVBTFRIX0hFSUdIVH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDEsIERJUkVDVElPTi5SSUdIVCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBGaWxsQmFyKHtwb3M6e3g6Q0FOVkFTLndpZHRoIC0gSEVBTFRIX1dJRFRIIC0gMTAsIHk6MTB9LCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2l6ZTp7d2lkdGg6IEhFQUxUSF9XSURUSCwgaGVpZ2h0OiBIRUFMVEhfSEVJR0hUfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMSwgRElSRUNUSU9OLkxFRlQpXTtcbiAgICB9XG5cbiAgICBzdGF0aWMgSW5pdGlhdGUoKTogR2FtZVN0YXRlIHsgcmV0dXJuIG5ldyBHYW1lU3RhdGUoKTsgfVxuXG4gICAgdXBkYXRlX3BsYXllcihpZDogbnVtYmVyKXtcbiAgICAgICAgbGV0IG90aGVyID0gMDtcbiAgICAgICAgaWYoaWQ9PTApe290aGVyID0gMX1cbiAgICAgICAgZWxzZSBpZihpZD09MSl7b3RoZXIgPSAwfVxuICAgICAgICBlbHNleyBcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBXcm9uZyBQbGF5ZXIgSWQgJHtpZH0gd2FzIHByb3ZpZGVkYCk7XG4gICAgICAgICAgICBwcm9jZXNzLmV4aXQoMSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHRoaXMucGxheWVyc1tpZF0udXBkYXRlKENPTlRFWFQsIENBTlZBUywgR1JBVklUWSwgdGhpcy5wbGF5ZXJzW290aGVyXSk7XG4gICAgICAgIHRoaXMuaGVhbHRfYmFyX3BsYXllcnNbaWRdLnVwZGF0ZSh0aGlzLnBsYXllcnNbaWRdLmxpZmVfZGlzcGxheS8xMDApO1xuICAgICAgICB0aGlzLmhlYWx0X2Jhcl9wbGF5ZXJzW2lkXS5kcmF3KENPTlRFWFQpO1xuXG4gICAgICAgIGVudGl0eV9jb250cm9sbGVyKHRoaXMucGxheWVyc1tpZF0sIHRoaXMucGxheWVyc1tvdGhlcl0sIENBTlZBUywgS0VZUywgQ09OVFJPTExFUl9LRVlTW2lkXSlcbiAgICB9XG5cbn1cblxubGV0IEtFWVM6IHtba2V5OiBzdHJpbmddOiBib29sZWFufSA9IHt9O1xubGV0IFBMQVlFUl8wX0NPTlRST0xMRVJfS0VZUzogQ29udHJvbGVLZXlzID0ge2xlZnQ6J2EnLCByaWdodDonZCcsIHVwOid3JywgZG93bjoncycsIGF0dGFjazonYyd9O1xubGV0IFBMQVlFUl8xX0NPTlRST0xMRVJfS0VZUyA9IHtsZWZ0OidBcnJvd0xlZnQnLCByaWdodDonQXJyb3dSaWdodCcsIHVwOidBcnJvd1VwJywgZG93bjonQXJyb3dEb3duJywgYXR0YWNrOicsJ307XG5cbmxldCBDT05UUk9MTEVSX0tFWVMgPSBbIFxuICAgIFBMQVlFUl8wX0NPTlRST0xMRVJfS0VZUyxcbiAgICBQTEFZRVJfMV9DT05UUk9MTEVSX0tFWVNcbl1cblxubGV0IEdBTUVfT1ZFUiA9IGZhbHNlO1xuXG5mdW5jdGlvbiBnYW1lX292ZXJfY2hlY2socGxheWVyOiBQbGF5ZXIsIG90aGVyX3BsYXllcl9uYW1lOiBzdHJpbmcpe1xuXG4gICAgbGV0IGdhbWVfb3ZlciA9IHBsYXllci5saWZlPD0wO1xuICAgIGlmKGdhbWVfb3Zlcil7XG4gICAgICAgIGRyYXdfdGV4dChgR2FtZSBPdmVyISAke290aGVyX3BsYXllcl9uYW1lfSB3b24hYCwge3g6Q0FOVkFTLndpZHRoLzIsIHk6Q0FOVkFTLmhlaWdodC8yfSwgNTAsIDUwLCBcIndoaXRlXCIsIENPTlRFWFQpO1xuICAgIH1cbiAgICByZXR1cm4gZ2FtZV9vdmVyO1xufVxuXG5sZXQgR1MgPSBHYW1lU3RhdGUuSW5pdGlhdGUoKTtcblxuZnVuY3Rpb24gYW5pbWF0ZSgpIHtcblxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlKTtcblxuXG4gICAgR0FNRV9PVkVSID0gR0FNRV9PVkVSIHx8IGdhbWVfb3Zlcl9jaGVjayhHUy5wbGF5ZXJzWzBdLCBcIlBsYXllciAyXCIpO1xuICAgIEdBTUVfT1ZFUiA9IEdBTUVfT1ZFUiB8fCBnYW1lX292ZXJfY2hlY2soR1MucGxheWVyc1sxXSwgXCJQbGF5ZXIgMVwiKTtcblxuICAgIGlmKCFHQU1FX09WRVIpe1xuICAgICAgICBDT05URVhULmZpbGxTdHlsZSA9ICdibGFjayc7XG4gICAgICAgIENPTlRFWFQuZmlsbFJlY3QoMCwgMCwgQ0FOVkFTLndpZHRoLCBDQU5WQVMuaGVpZ2h0KTtcblxuICAgICAgICBHUy51cGRhdGVfcGxheWVyKDApO1xuICAgICAgICBHUy51cGRhdGVfcGxheWVyKDEpO1xuICAgIH1cbn1cblxuXG5jb25zdCByZXN0YXJ0X2J1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN0YXJ0X2J1dHRvbicpO1xuXG5yZXN0YXJ0X2J1dHRvbj8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coR0FNRV9PVkVSKTtcblxuICAgIEdBTUVfT1ZFUiA9IGZhbHNlO1xuICAgIEdTID0gR2FtZVN0YXRlLkluaXRpYXRlKCk7XG4gICAgY29uc29sZS5sb2coR0FNRV9PVkVSKTtcbn0pXG5cblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZlbnQpID0+IHtcbiAgICBLRVlTW2V2ZW50LmtleV0gPSB0cnVlIFxuICAgIGlmKE9iamVjdC52YWx1ZXMoUExBWUVSXzBfQ09OVFJPTExFUl9LRVlTKS5pbmNsdWRlcyhldmVudC5rZXkpKXsgR1MucGxheWVyc1swXS5sYXN0X2tleSA9IGV2ZW50LmtleTsgfSBcbiAgICBpZihPYmplY3QudmFsdWVzKFBMQVlFUl8xX0NPTlRST0xMRVJfS0VZUykuaW5jbHVkZXMoZXZlbnQua2V5KSl7IEdTLnBsYXllcnNbMV0ubGFzdF9rZXkgPSBldmVudC5rZXk7IH1cbn0pXG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIChldmVudCkgPT4geyBLRVlTW2V2ZW50LmtleV0gPSBmYWxzZSB9KVxuXG5cbmFuaW1hdGUoKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==