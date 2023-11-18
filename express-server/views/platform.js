import { Challenge } from "./challenges.js";

export class Platform {
    constructor(game, x, y, type = 'none') {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 450;
        this.height = 58;
        this.onPlat = false;
        this.image = document.getElementById('platform');
        this.type = type;
        if (this.type !== 'none') {
            this.game.challenges.push(new Challenge(this.game, this.type, this.x, this.y, this.width));
        }
    }
    update() {
        if (this.game.player.y + this.game.player.height <= this.y &&
            this.game.player.y + this.game.player.height + this.game.player.vy >= this.y &&
            this.game.player.x + this.game.player.width >= this.x + 30 &&
            this.game.player.x + 40 <= this.x + this.width) {
            this.game.player.vy = 0;
            this.onPlat = true;
            } else this.onPlat = false;
    }
    draw(context) {
        context.drawImage(this.image, this.x, this.y - 10, this.width, this.height);
    }
}
