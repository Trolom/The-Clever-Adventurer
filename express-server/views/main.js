import {Platform} from './platform.js';
import {Player} from './player.js';
import {InputHandler} from './input.js';
import { Background } from './background.js';
import { FlyingEnemy, ClimbingEnemy, GroundEnemy, CrawlingEnemy } from "./enemies.js";
import { UI } from './UI.js';

window.addEventListener('load', function() {
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;

class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.groundMargin = 55;
        this.background = new Background(this);
        this.player = new Player(this);
        this.input = new InputHandler(this);
        this.UI = new UI(this);
        this.challenges = [];
        this.enemies = [];
        this.particles = [];
        this.collisions = [];
        this.floatingMessages = [];
        this.maxParticles = 100;
        this.enemyTimer = 0;
        this.enemyInterval = 1000;
        this.debug = false;
        this.score = 0;
        this.winningScore = 50;
        this.fontColor = 'black';
        this.time = 0;
        this.maxTime = 50000;
        this.gameOver = false;
        this.pause = false;
        this.inChallenge = false;
        this.lives = 5;
        this.player.currentState = this.player.states[0];
        this.player.currentState.enter();
        this.scrollOffSet = 0;
        this.maxScrollOffSet = 4000;
        this.platforms = [new Platform(this, 400, 300, 'writeAns'), new Platform(this, 800, 200, 'chooseOpt'), new Platform(this, 2000, 200), new Platform(this, 3400, 100, 'chooseOpt'), new Platform(this, 3000, 400, 'writeAns'), new Platform(this, 3900, 200), new Platform(this, 4700, 250, 'writeAns'), new Platform(this, 6000, 300), new Platform(this, 6300, 400), new Platform(this, 6900, 200, 'chooseOpt'), new Platform(this, 8000, 200, 'writeAns'), new Platform(this, 8700, 350), new Platform(this, 9000, 100), new Platform(this, 10100, 250, 'writeAns'), new Platform(this, 11500, 100), new Platform(this, 11300, 400, 'chooseOpt')];
    }
    update(deltaTime) {
        console.log(this.scrollOffSet);
        this.time += deltaTime;

        if (this.time > this.maxTime || this.scrollOffSet > this.maxScrollOffSet) this.gameOver = true;
        if (this.input.keys.esc.pressed) {
            this.pause = true;
        }
        
        this.player.update(this.input, deltaTime);
        //handleEnemies
        if (this.enemyTimer > this.enemyInterval) {
            this.addEnemy();
            this.enemyTimer = 0;
        } else {
            this.enemyTimer += deltaTime;
        }
        this.enemies.forEach(enemy => {
            enemy.update(deltaTime);
        });
        this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
        //handle platforms
        this.platforms.forEach(platform => {
            platform.update();
        });
        //handle challenges
        this.challenges.forEach(challenge => {
            challenge.update(deltaTime);
        });
        
        //handle messages
        this.floatingMessages.forEach(message => {
            message.update();
        });
        this.floatingMessages = this.floatingMessages.filter(message => !message.markedForDeletion);
        //handle particles
        this.particles.forEach((particle, index) => {
            particle.update();
        });
        if (this.particles.length > this.maxParticles) {
            this.particles.length = this.maxParticles;
        }
        this.particles = this.particles.filter(particle => !particle.markedForDeletion);

        //handle collision sprites
        this.collisions.forEach((collision, index) => {
            collision.update(deltaTime);
        });
        this.collisions = this.collisions.filter(collision => !collision.markedForDeletion);
        console.log(this.challenges);

    }
    draw(context, document) {
        this.background.draw(context);
        this.challenges.forEach(challenge => {
            challenge.draw(context, document);
        });
        this.player.draw(context);
        this.enemies.forEach(enemy => {
            enemy.draw(context);
        });
        this.particles.forEach(particle => {
            particle.draw(context);
        });
        this.collisions.forEach((collision, index) => {
            collision.draw(context);
        });
        this.floatingMessages.forEach(message => {
            message.draw(context);
        });
        this.platforms.forEach(platform => {
            platform.draw(context);
        });
        this.UI.draw(context, document);
        
    }
    addEnemy() {
        if (Math.random() < 0.3) this.enemies.push(new GroundEnemy(this));
        if (0.3 <Math.random() > 0.5) this.enemies.push(new FlyingEnemy(this));
        if (0.5 < Math.random() < 0.7) this.enemies.push(new CrawlingEnemy(this));
        if (0.7 < Math.random() < 0.9) this.enemies.push(new ClimbingEnemy(this));
        
    }
}

const game = new Game(canvas.width, canvas.height);
let lastTime = 0;

function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update(deltaTime);
    game.draw(ctx, document);
    if (game.pause) pause();
    else if (game.inChallenge) chal();
    else if (game.gameOver) {
        setTimeout(function() {
            location.reload();
        }, 3000);
        addScoreboard();
    }
    else if (!game.gameOver && !game.pause && !game.inChallenge) requestAnimationFrame(animate);
    
}
function pause() {
    if (game.input.keys.up.pressed || game.input.keys.left.pressed || game.input.keys.right.pressed || game.input.keys.down.pressed){
        game.pause = false;
        requestAnimationFrame(animate);
    }
    else executeAfterDelay(pause, 0.3);
}

function chal() {
    if (game.inChallenge) executeAfterDelay(chal, 0.3);
    else requestAnimationFrame(animate);
}

function executeAfterDelay(callback, delayInSeconds) {
    setTimeout(callback, delayInSeconds * 1000);
}
 

animate(0);


});