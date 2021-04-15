

import Phaser from '../lib/phaser.js'



export default class Game extends Phaser.Scene
{
	
	/** @type {Phaser.Physics.Arcade.Sprite} */
	player

	/** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
	cursors

	constructor()
	{
		super('game')
	}
	preload()
	{
		this.load.image('background', 'assets/background.png')
		   //assets moto
		   this.load.image('motoBlue','kenney_racingpack_updated/PNG/Motorcycles/motorcycle_black.png')
		   this.load.image('motoGreen','kenney_racingpack_updated/PNG/Motorcycles/motorcycle_green.png')
		   this.load.image('motoBlack','kenney_racingpack_updated/PNG/Motorcycles/motorcycle_blue.png')
		   this.load.image('motoRed','kenney_racingpack_updated/PNG/Motorcycles/motorcycle_red.png')
		   this.load.image('motoYellow','kenney_racingpack_updated/PNG/Motorcycles/motorcycle_yellow.png')
		   
   
		   //assets motard
		   this.load.image('racerBlue','kenney_racingpack_updated/PNG/Characters/racer_blue.png')
		   this.load.image('racerGreen','kenney_racingpack_updated/PNG/Characters/racer_green.png') 
		   this.load.image('racerBlack','kenney_racingpack_updated/PNG/Characters/racer_black.png') 
		   this.load.image('racerRed','kenney_racingpack_updated/PNG/Characters/racer_red.png')
		   this.load.image('racerYellow','kenney_racingpack_updated/PNG/Characters/racer_yellow.png') 
		   this.load.image('sika', 'assets/rage-of-sika-sprite.png')
	
		this.cursors = this.input.keyboard.createCursorKeys()
	}

	create()
	{
		this.add.image(240,320, 'background')
		this.add.image(420,670,'motoBlue')
        this.add.image(320,620,'motoGreen')
        this.add.image(620,650,'motoBlack')
        this.add.image(500,650,'motoRed')
        this.add.image(500,500,'motoYellow')
    
		this.player = this.physics.add.sprite(240, 320, 'sika')
			.setScale(0.5)

		this.physics.add.collider(this.platforms, this.player)
		
		this.player.body.checkCollision.up = false
		this.player.body.checkCollision.left = false
		this.player.body.checkCollision.right = false

		this.cameras.main.startFollow(this.player)
		this.cameras.main.setDeadzone(this.scale.width * 1.5)

		this.physics.add.collider(this.platforms, this.carrots)
		this.physics.add.overlap(this.player, this.carrots, this.handleCollectCarrot, undefined, this)

		
	}

	update(t, dt)
	{
		if (!this.player)
		{
			return
		}

		

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
	
}