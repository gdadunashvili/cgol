var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');
c.fillRect(0, 0, canvas.width, canvas.height);
var gravity = 0.7;
var vec2d = /** @class */ (function () {
    function vec2d(x, y) {
        this.x = x;
        this.y = y;
    }
    return vec2d;
}());
var Sprite = /** @class */ (function () {
    function Sprite(_a) {
        var pos = _a.pos, vel = _a.vel, style = _a.style;
        this.pos = pos;
        this.vel = vel;
        var height = 150;
        this.size = { width: 50, height: height,
            standup_height: height,
            duck_height: height * 0.6 };
        this.style = style;
    }
    Sprite.prototype.draw = function () {
        c.fillStyle = this.style;
        c.fillRect(this.pos.x, this.pos.y, this.size.width, this.size.height);
    };
    Sprite.prototype.update = function () {
        this.draw();
        if (this.pos.y + this.size.height >= canvas.height) {
            this.vel.y = 0;
            this.pos.y -= this.pos.y + this.size.height - canvas.height;
        }
        else {
            this.vel.y += gravity;
        }
        if (this.pos.x < 0 ||
            this.pos.x + this.size.width > canvas.width) {
            this.vel.x *= -1;
        }
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
    };
    return Sprite;
}());
var player = new Sprite({
    pos: { x: 500, y: 0 },
    vel: { x: 0, y: 0 },
    style: 'red'
});
var enemy = new Sprite({
    pos: { x: 100, y: 10 },
    vel: { x: 0, y: 0 },
    style: 'blue'
});
var keys = { a: false, s: false, d: false, w: false };
function entity_controler(entity, controle_keys) {
    var speed = 5;
    var jump = 20;
    entity.vel.x = 0;
    if (keys[controle_keys.left_key] &&
        (entity.last_key === controle_keys.left_key
            || entity.last_key === controle_keys.up_key)) {
        console.log('a');
        entity.vel.x = -speed;
    }
    if (keys[controle_keys.right_key] &&
        (entity.last_key === controle_keys.right_key
            || entity.last_key === controle_keys.up_key)) {
        entity.vel.x = speed;
    }
    if (keys[controle_keys.up_key]) {
        if (entity.pos.y > canvas.height - 1.05 * entity.size.height) {
            entity.pos.y -= 1.1;
            entity.vel.y = -jump;
        }
        keys.w = false;
    }
    if (keys[controle_keys.down_key]) {
        entity.size.height = entity.size.duck_height;
    }
    else {
        entity.size.height = entity.size.standup_height;
        // entity.pos.y = canvas.height - entity.size.height
    }
}
var player_controler_keys = { left_key: 'a', right_key: 'd', up_key: 'w', down_key: 's' };
var enemy_controler_keys = { left_key: 'ArrowLeft', right_key: 'ArrowRight', up_key: 'ArrowUp', down_key: 'ArrowDown' };
function animate() {
    requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    enemy.update();
    entity_controler(player, player_controler_keys);
    entity_controler(enemy, enemy_controler_keys);
}
animate();
window.addEventListener('keydown', function (event) {
    keys[event.key] = true;
    // @ts-ignore
    if (Object.values(player_controler_keys).includes(event.key)) {
        player.last_key = event.key;
    }
    // @ts-ignore
    if (Object.values(enemy_controler_keys).includes(event.key)) {
        enemy.last_key = event.key;
    }
});
window.addEventListener('keyup', function (event) { keys[event.key] = false; });
// ToDo List
// - [ ] Tacke care of border glitches
// - [ ] Attack
//   - [ ] Colision Resolution
// - [ ] Health bar
// - [ ] Game Timers and End Screen
// - [ ] State saving in a Database
// - [ ] Improved sprites (ask Sarah for help)
