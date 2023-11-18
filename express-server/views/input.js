export class InputHandler {
    constructor(game) {
        this.game = game;
        this.keys = {
            right: {
                pressed: false
            },
            left: {
                pressed: false
            },
            up: {
                pressed: false
            },
            down: {
                pressed: false
            },
            power: {
                pressed: false
            },
            esc: {
                pressed: false
            }
        };
        

        window.addEventListener('keydown', e => {

            switch (e.key) {
                case 'a':
                    //console.log('left')
                    this.keys.left.pressed = true;
                    break;
                case 's':
                    //console.log('down')
                    this.keys.down.pressed = true;
                    break;
                case 'd':
                    //console.log('right')
                    this.keys.right.pressed = true;
                    break;
                case 'w':
                    //console.log('up')
                    this.keys.up.pressed = true;
                    break;
                case 'q':
                     //console.log('power')
                     this.keys.power.pressed = true;
                    
                    break;
                    case 'Escape':
                        //console.log('escape')
                        this.keys.esc.pressed = true;
                       break;
            }
            if (e.key === 'f') this.game.debug = !this.game.debug;
        })

        window.addEventListener('keyup', e => {

            switch (e.key) {
                case 'a':
                    //console.log('left')
                    this.keys.left.pressed = false;
                    break;
                case 's':
                    //console.log('down')
                    this.keys.down.pressed = false;
                    break;
                case 'd':
                    //console.log('right')
                    this.keys.right.pressed = false;
                    break;
                case 'w':
                    //console.log('up')
                    this.keys.up.pressed = false;
                    break;
                case 'q':
                    //console.log('power')
                    this.keys.power.pressed = false;
                    break;
                case 'Escape':
                    //console.log('escape')
                    this.keys.esc.pressed = false;
                    break;
            }

        })
    }
}