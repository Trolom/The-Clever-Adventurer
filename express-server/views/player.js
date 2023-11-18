import { Standing, Running, Jumping, Falling, Attacking, Diving, Hit } from "./playerStates.js";
import { CollisionAnimation } from './collisionAnimation.js';
import { FloatingMessage } from "./floatingMessages.js";

export class Player {
    constructor(game) {
        this.game = game;
        this.width = 130;
        this.height = 126;
        this.x = 120;
        this.y = this.game.height - this.height- this.game.groundMargin;
        this.vy = 0;
        this.weight = 1;
        this.image = document.getElementById('playerIdle');
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame = 8;
        this.fps = 20;
        this.frameInterval = 1000/this.fps;
        this.frameTimer = 0;
        this.speed = 0;
        this.maxSpeed = 0;
        this.speedModifier = 8;
        this.images = [document.getElementById('playerIdle'), document.getElementById('playerRun'), document.getElementById('playerJump'), document.getElementById('playerFall'), document.getElementById('playerAttack1'), document.getElementById('playerAttack2'), document.getElementById('playerHit')];
        this.states = [new Standing(this.game), new Running(this.game), new Jumping(this.game), new Falling(this.game), new Attacking(this.game), new Diving(this.game), new Hit(this.game)];
        this.currentState = null;
        this.enemiesKilled = 0;
    }
    update(input, deltaTime) {
        this.checkCollisionEnemy();
        this.checkCollisionChallenges();
        this.currentState.handleInput(input);
        //horizontal movement as well as enemy and background movement
        this.x += this.speed;
        if (input.keys.right.pressed && this.currentState !== this.states[6] && this.x < 400) {
            this.speed = this.maxSpeed;
        }
        else if (input.keys.left.pressed && this.x > 100) {
            this.speed = -this.maxSpeed;
        }
        else {
            this.speed = 0;
            
            if (input.keys.right.pressed && this.currentState !== this.states[6]) {
                this.game.scrollOffSet += 3;
                this.game.background.update(this.maxSpeed);
                this.game.platforms.forEach(platform => {
                    platform.x -= this.maxSpeed;
                });
            } else if (input.keys.left.pressed && this.currentState !== this.states[6] && this.game.scrollOffSet > 0) {
                this.game.background.update(-this.maxSpeed);
                this.game.scrollOffSet -= 3;
                this.game.platforms.forEach(platform => {
                    platform.x += this.maxSpeed;
                });
                
            }
        }
        
        //vertical movement
        this.y += this.vy;
        if (!this.onGround()) this.vy += this.weight;
        else this.vy = 0;
        //vertical boundaries
        if (this.y > this.game.height - this.height - this.game.groundMargin) {
            this.y = this.game.height - this.height - this.game.groundMargin;
        }
        //control fps for sprite
        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0;
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
        } else {
            this.frameTimer += deltaTime;
        }
        
        
    }
    draw(context) {
        if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
        if (this.currentState === this.states[5])
            context.drawImage(this.image, this.frameX * 250, 0, 250, this.height, this.x, this.y, 250, this.height)
        context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height)
    }

    onGround() {
        return this.y >= this.game.height - this.height - this.game.groundMargin;
    }
    onPlatform() {
        let on = false;
        this.game.platforms.forEach(platform => {
            if (platform.onPlat){
                on = platform.onPlat;
            }
        });
        return on;
    }
    
    setState(state, speed) {
        this.currentState = this.states[state];
        this.maxSpeed = this.speedModifier * speed;
        this.currentState.enter();
        this.image = this.images[state];
    }
    checkCollisionEnemy() {
        this.game.enemies.forEach(enemy => {
            if (
                enemy.x < this.x + this.width &&
                enemy.x + enemy.width > this.x &&
                enemy.y + enemy.height > this.y &&
                this.y + this.height > enemy.y
            ) {
                //collision detected
                enemy.markedForDeletion = true;
                this.game.collisions.push(new CollisionAnimation(this.game, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5))
                if (this.currentState === this.states[4] || this.currentState === this.states[5]) {
                    this.game.score += 3;
                    this.enemiesKilled++;
                    this.game.floatingMessages.push(new FloatingMessage('+1', enemy.x, enemy.y, 150, 100));
                } else {
                    this.setState(6, 0);
                    this.game.score -= 5;
                    this.game.lives--;
                    if (this.game.lives <= 0) this.game.gameOver = true;
                }
                
            } 
        });
    }

    checkCollisionChallenges() {
        this.game.challenges.forEach(challenge => {
            if (
                challenge.x < this.x + this.width &&
                challenge.x + challenge.width > this.x &&
                challenge.y + challenge.height > this.y &&
                this.y + this.height > challenge.y
            ) {
                //collision detected
                challenge.markedForDeletion = true;
                this.game.inChallenge = true;
            } 
        });
    }
}