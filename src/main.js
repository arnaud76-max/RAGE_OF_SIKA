import Phaser from './lib/phaser.js'

import Game from './scenes/Game.js'
import GameOver from './scenes/GameOver.js'

export default new Phaser.Game({
    type:Phaser.AUTO,
    width: 800,
    height: 1000,
    scene:Game,
    physics:{
        default:'arcade',
        arcade:{
            gravity:{
                y: 200
            },
            debug:true
        }
    }
   
})

