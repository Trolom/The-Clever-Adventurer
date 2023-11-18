import { Dust, Fire, Splash } from './particles.js';
const states = {
    STANDING: 0,
    RUNNING: 1,
    JUMPING: 2,
    FALLING: 3,
    ATTACKING: 4,
    DIVING: 5,
    HIT: 6
}

class State {
    constructor(state, game) {
        this.game = game;
        this.state = state;
    }

}


export class Standing extends State{
    constructor(game) {
        super('STANDING', game);
    } 
    enter() {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 7;
    }
    handleInput(input) {
        if (input.keys.left.pressed || input.keys.right.pressed) {
            this.game.player.setState(states.RUNNING, 1);
        } else if(input.keys.power.pressed) {
            this.game.player.setState(states.ATTACKING, 1.2);
        }else if (input.keys.up.pressed) {
            this.game.player.setState(states.JUMPING, 1);
        }
    }
}

export class Running extends State{
    constructor(game) {
        super('RUNNING', game);
    } 
    enter() {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 7;
        
    }
    handleInput(input) {
        this.game.particles.push(new Dust(this.game, this.game.player.x + this.game.player.width * 0.5, this.game.player.y + this.game.player.height));
        if (input.keys.up.pressed) {
            this.game.player.setState(states.JUMPING, 1);
        } else if(input.keys.power.pressed) {
            this.game.player.setState(states.ATTACKING, 1.2);
        } else if (!input.keys.left.pressed && !input.keys.right.pressed) {
            this.game.player.setState(states.STANDING, 0);
        }

    }
}

export class Jumping extends State{
    constructor(game) {
        super('JUMPING', game);
    } 
    enter() {
        if (this.game.player.onGround() || this.game.player.onPlatform()) this.game.player.vy -= 27;
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 1;
        
    }
    handleInput(input) {
        if (this.game.player.vy > this.game.player.weight) {
            this.game.player.setState(states.FALLING, 1);
        } else if(input.keys.power.pressed) {
            this.game.player.setState(states.ATTACKING, 1.2);
        } else if (input.keys.down.pressed) {
            this.game.player.setState(states.DIVING, 0);
        }
    }
}

export class Falling extends State{
    constructor(game) {
        super('FALLING', game);
    } 
    enter() {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 1;
        
    }
    handleInput(input) {
        if (this.game.player.onGround() || this.game.player.onPlatform()) {
            this.game.player.setState(states.RUNNING, 1);
        } else if (input.keys.down.pressed) {
            this.game.player.setState(states.DIVING, 0);
        }
    }
}

export class Attacking extends State{
    constructor(game) {
        super('ATTACKING', game);
    } 
    enter() {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 6;
        
    }
    handleInput(input) {
        //this.game.particles.unshift(new Fire(this.game, this.game.player.x + this.game.player.width * 0.5, this.game.player.y + this.game.player.height * 0.5));
        if (!input.keys.power.pressed && this.game.player.onGround()) {
            this.game.player.setState(states.RUNNING, 1);
        } else if (!input.keys.power.pressed && !this.game.player.onGround()) {
            this.game.player.setState(states.FALLING, 1);
        } else if (input.keys.power.pressed && input.keys.up.pressed && this.game.player.onGround()) {
            this.game.player.vy -= 27;
        } else if (input.keys.down.pressed && !this.game.player.onGround()) {
            this.game.player.setState(states.DIVING, 0);
        } 
    }
}

export class Diving extends State{
    constructor(game) {
        super('DIVING', game);
    } 
    enter() {
        
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 5;
        
        this.game.player.vy = 15;
        
    }
    handleInput(input) {
        
        this.game.particles.unshift(new Fire(this.game, this.game.player.x + this.game.player.width * 0.5, this.game.player.y + this.game.player.height * 0.5));
        if (this.game.player.onGround()) {
            this.game.player.setState(states.RUNNING, 1);
            /*for(let i = 0; i < 30; i++) {
                this.game.particles.unshift(new Splash(this.game, this.game.player.x + this.game.player.width * 0.5, this.game.player.y + this.game.player.height));     
            }*/
        } else if (input.keys.power.pressed && !this.game.player.onGround()) {
            this.game.player.setState(states.ATTACKING, 1.2);
        }
    }
}


export class Hit extends State{
    constructor(game) {
        super('HIT', game);
    } 
    enter() {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 4;
        
    }
    handleInput(input) {
        if (this.game.player.frameX >=4 && this.game.player.onGround()) {
            this.game.player.setState(states.STANDING, 1);
        } else if (this.game.player.frameX >=4 && !this.game.player.onGround()) {
            this.game.player.setState(states.FALLING, 1);
        }
    }
}

