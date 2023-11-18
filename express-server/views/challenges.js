export class Challenge {
    constructor(game, type, x, y, width) {
        this.game = game;
        this.frameX = 0;
        this.frameY = 0;
        this.fps = 20;
        this.frameInterval =1000/this.fps;
        this.frameTimer = 0;
        this.markedForDeletion = false;
        this.width = 62;
        this.height = 124;
        this.x = x + this.width/2 + 150;
        this.y = y - this.height;
        this.platform_width = width;
        this.maxFrame = 11;
        this.type = type;
        
        if (this.type === 'writeAns') {
            this.image = document.getElementById('challenge');
        }//bronze
        else if (this.type === 'chooseOpt') {
            this.image = document.getElementById('challenge');
        }

        this.imageBackground = document.getElementById('pause');
        this.fontSize = 30;
        this.fontFamily = "Helvetica";
        this.answer = null;
        this.correctAns = null;
        this.displayBar;
        this.submitButton;
    }
    update(deltaTime) {
        //movement
        if (this.game.player.speed ==  0 && this.game.input.keys.right.pressed)
        this.x -= this.game.player.maxSpeed;
        else if (this.game.player.speed ==  0 && this.game.input.keys.left.pressed && this.game.scrollOffSet > 0)
        this.x += this.game.player.maxSpeed;
        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0;
            if(this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
        } else {
            this.frameTimer += deltaTime;
        }
        
    }

    draw(context) {
        context.save();
        if (this.game.debug) context.strokeRect( this.x, this.y, this.width, this.height);
        context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);
        context.restore();
    }
    
}
