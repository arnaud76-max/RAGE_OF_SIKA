

import Phaser from '../lib/phaser.js'

import Gland from '../game/Gland.js'

export default class Game extends Phaser.Scene
{
            /** @type {Phaser.Physics.Arcade.StaticGroup} */
	            motorcycles

            /** @type {Phaser.Physics.Arcade.Sprite} */
                player
                /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
                cursors
                /** @type {Phaser.Physics.Arcade.Group} */
                glands

                glandsCollected = 0;
                /** @type {Phaser.GameObjects.Text} */
                glandsCollectedText


                constructor()
                {
                    super('game')
                }
                init()
                {
                        this.glandsCollected = 0;
                }
                preload() 
	            {
                     this.load.image('ground', 'assets/background.png')
		   //assets moto
		            this.load.image('motorcycle','kenney_racingpack_updated/PNG/Motorcycles/motorcycle_blue.png')
	                this.load.image('motoGreen','kenney_racingpack_updated/PNG/Motorcycles/motorcycle_green.png')
		            this.load.image('motoBlack', 'kenney_racingpack_updated/PNG/Motorcycles/motorcycle_black.png')
		   
		   
   
                    //assets motard
                    this.load.image('motorcycle','kenney_racingpack_updated/PNG/Characters/racer_blue.png')
                    this.load.image('racerGreen','kenney_racingpack_updated/PNG/Characters/racer_green.png') 
                    this.load.image('racerBlack','kenney_racingpack_updated/PNG/Characters/racer_black.png') 
                    this.load.image('racerRed','kenney_racingpack_updated/PNG/Characters/racer_red.png')
                    this.load.image('racerYellow','kenney_racingpack_updated/PNG/Characters/racer_yellow.png') 
                    this.load.image('sika', 'assets/rage-of-sika-sprite.png')


                    this.load.image('gland', 'assets/gland.png')
                    this.load.image('rage', 'assets/button_rage.png')

                    this.cursors = this.input.keyboard.createCursorKeys()

                }
                create()
                {
                    this.add.image(240, 320, 'ground')
                        .setScrollFactor(1, 0)
            
                    this.motorcycles = this.physics.add.staticGroup()
            
                   
                    for (let i = 0; i < 5; ++i)
                    {
                        const x = Phaser.Math.Between(80, 400)
                        const y = 150 * i
                
                        /** @type {Phaser.Physics.Arcade.Sprite} */
                        const motorcycle = this.motorcycles.create(x, y, 'motorcycle')
                        motorcycle.scale = 0.5
                
                        /** @type {Phaser.Physics.Arcade.StaticBody} */
                        const body = motorcycle.body
                        body.updateFromGameObject()
                    }
            
                    this.player = this.physics.add.sprite(240, 320, 'sika')
                        .setScale(0.5)
            
                    this.physics.add.collider(this.motorcycles, this.player)
                    
                    this.player.body.checkCollision.up = false
                    this.player.body.checkCollision.left = false
                    this.player.body.checkCollision.right = false
            
                    this.cameras.main.startFollow(this.player)
                    this.cameras.main.setDeadzone(this.scale.width * 1.5)
            
                    this.glands = this.physics.add.group({
                        classType: Gland
                    })
            
                    this.physics.add.collider(this.motorcycles, this.glands)
                    this.physics.add.overlap(this.player, this.glands, this.handleCollectGland, undefined, this)
            
                    this.glandsCollectedText = this.add.text(240, 10, 'Glands: 0', { color: '#000', fontSize: 24 })
                        .setScrollFactor(0)
                        .setOrigin(0.5, 0)
                }
            
                update(t, dt)
                {
                    if (!this.player)
                    {
                        return
                    }
            
                    this.motorcycles.children.iterate(child => {
                        /** @type {Phaser.Physics.Arcade.Sprite} */
                        const motorcycle = child
            
                        const scrollY = this.cameras.main.scrollY
                        if (motorcycle.y >= scrollY + 700)
                        {
                            motorcycle.y = scrollY - Phaser.Math.Between(50, 100)
                            motorcycle.body.updateFromGameObject()
                            this.addGlandAbove(motorcycle)
                        }
                    })
            
                    const touchingDown = this.player.body.touching.down
            
                    if (touchingDown)
                    {
                        this.player.setVelocityY(-300)
                        this.player.setTexture('sika')
            
                    
                    }
            
                    const vy = this.player.body.velocity.y
                    if (vy > 0 && this.player.texture.key !== 'sika')
                    {
                        this.player.setTexture('sika')
                    }
            
                    if (this.cursors.left.isDown && !touchingDown)
                    {
                        this.player.setVelocityX(-200)
                    }
                    else if (this.cursors.right.isDown && !touchingDown)
                    {
                        this.player.setVelocityX(200)
                    }
                    else
                    {
                        this.player.setVelocityX(0)
                    }
            
                    this.horizontalWrap(this.player)
            
                    const bottomMotorcycle = this.findBottomMostMotorcycle()
                    if (this.player.y > bottomMotorcycle.y + 200)
                    {
                        this.scene.start('game-over')
                    }
                }
            
                /**
                 * 
                 * @param {Phaser.GameObjects.Sprite} sprite 
                 */
                horizontalWrap(sprite)
                {
                    const halfWidth = sprite.displayWidth * 0.5
                    const gameWidth = this.scale.width
                    if (sprite.x < -halfWidth)
                    {
                        sprite.x = gameWidth + halfWidth
                    }
                    else if (sprite.x > gameWidth + halfWidth)
                    {
                        sprite.x = -halfWidth
                    }
                }
            
                /**
                 * 
                 * @param {Phaser.GameObjects.Sprite} sprite 
                 */
                addGlandAbove(sprite)
                {
                    const y = sprite.y - sprite.displayHeight
            
                    /** @type {Phaser.Physics.Arcade.Sprite} */
                    const gland = this.glands.get(sprite.x, y, 'gland')
            
                    gland.setActive(true)
                    gland.setVisible(true)
            
                    this.add.existing(gland)
            
                    gland.body.setSize(gland.width, gland.height)
            
                    this.physics.world.enable(gland)
            
                    return gland
                }
            
                /**
                 * 
                 * @param {Phaser.Physics.Arcade.Sprite} player 
                 * @param {Gland} gland
                 */
                handleCollectGland(player, gland)
                {
                    this.glands.killAndHide(gland)
            
                    this.physics.world.disableBody(gland.body)
            
                    this.glandsCollected++
            
                    this.glandsCollectedText.text = `Gland: ${this.glandsCollected}`
                }
            
                findBottomMostMotorcycle()
                {
                    const motorcycles = this.motorcycles.getChildren()
                    let bottomMotorcycle = motorcycles[0]
            
                    for (let i = 1; i < motorcycles.length; ++i)
                    {
                        const motorcycle = motorcycles[i]
            
                        // discard any platforms that are above current
                        if (motorcycle.y < bottomMotorcycle.y)
                        {
                            continue
                        }
            
                        bottomMotorcycle = motorcycle
                    }
            
                    return bottomMotorcycle
                }
            }