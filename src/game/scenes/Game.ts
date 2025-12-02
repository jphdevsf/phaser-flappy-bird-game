import { Scene } from 'phaser'
import { Bird } from '../../objects/bird'
import { Pipe } from '../../objects/pipe'

export class Game extends Scene {
  private bird: Bird
  private pipes: Phaser.GameObjects.Group
  private background: Phaser.GameObjects.TileSprite
  private scoreText: Phaser.GameObjects.BitmapText
  private startText: Phaser.GameObjects.Text
  private gameState: 'ready' | 'playing' | 'gameOver' = 'ready'

  constructor () {
    super('Game')
  }

  init (): void {
    this.registry.set('score', 0)
    this.gameState = 'ready'
  }

  preload () {
    this.load.setPath('assets/')
    this.load.bitmapFont('font', 'font/font.png', 'font/font.fnt')
    this.load.image('background', 'images/bg.png')
    this.load.image('bird', 'images/bird.png')
    this.load.spritesheet('pipe', 'images/pipe.png', { frameWidth: 20, frameHeight: 20 })
  }

  create () {
    this.background = this.add
      .tileSprite(0, 0, 390, 600, 'background')
      .setOrigin(0, 0)

    this.scoreText = this.add
      .bitmapText(
        this.sys.canvas.width / 2 - 14,
        30,
        'font',
        this.registry.values.score
      )
      .setDepth(2)

    this.pipes = this.add.group({ classType: Pipe })

    this.bird = new Bird({
      scene: this,
      x: 50,
      y: 100,
      key: 'bird'
    })

    // Start text
    this.startText = this.add.text(
      this.sys.canvas.width / 2,
      this.sys.canvas.height / 2,
      'Press SPACE to start',
      {
        fontFamily: 'Arial',
        fontSize: 32,
        color: '##000000',
        align: 'center'
      }
    ).setOrigin(0.5).setDepth(10)

    // Pause physics initially
    this.physics.world.pause()
  }

  update (): void {
    if (this.gameState === 'ready') {
      // Wait for spacebar to start
      if (this.input!.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).isDown) {
        this.startGame()
      }
      return
    }

    if (this.gameState === 'playing') {
      this.background.tilePositionX += 4
      this.bird.update()
      if (this.bird.getDead()) {
        this.gameState = 'gameOver'
      }
      if (!this.bird.getDead()) {
        this.physics.add.overlap(this.bird, this.pipes, () => {
          this.bird.setDead(true)
          this.gameState = 'gameOver'
        })
      }
    }

    if (this.gameState === 'gameOver') {
      this.bird.update()
      if (this.bird.getDead()) {
        Phaser.Actions.Call(
          this.pipes.getChildren(),
          (pipe) => {
            pipe.body!.velocity.x = 0
          },
          this
        )
      }

      if (this.bird.y > this.sys.canvas.height) {
        this.scene.restart()
      }
    }
  }

  private addNewRowOfPipes (): void {
    // update the score
    this.registry.values.score += 1
    this.scoreText.setText(this.registry.values.score)

    // randomly pick a number between 1 and 5
    const hole = Math.floor(Math.random() * 5) + 1

    // add 6 pipes with one big hole at position hole and hole + 1
    for (let i = 0; i < 10; i++) {
      if (i !== hole && i !== hole + 1 && i !== hole + 2) {
        if (i === hole - 1) {
          this.addPipe(400, i * 60, 0)
        } else if (i === hole + 3) {
          this.addPipe(400, i * 60, 1)
        } else {
          this.addPipe(400, i * 60, 2)
        }
      }
    }
  }

  private addPipe (x: number, y: number, frame: number): void {
    // create a new pipe at the position x and y and add it to group
    this.pipes.add(
      new Pipe({
        scene: this,
        x,
        y,
        frame,
        key: 'pipe'
      })
    )
  }

  private startGame (): void {
    this.gameState = 'playing'
    this.startText.destroy()
    this.physics.world.resume()

    // Add overlap collider once
    this.physics.add.overlap(this.bird, this.pipes, () => {
      this.bird.setDead(true)
      this.gameState = 'gameOver'
    })

    // Initial pipe row
    this.addNewRowOfPipes()

    // Start pipe timer
    this.time.addEvent({
      delay: 1500,
      callback: this.addNewRowOfPipes,
      callbackScope: this,
      loop: true
    })
  }
}
