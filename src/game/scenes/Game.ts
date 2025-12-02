import { Scene } from 'phaser'
import { Bird } from '../../objects/bird'
import { Pipe } from '../../objects/pipe'
import { GameState } from '../states/GameState'
import { ReadyState } from '../states/ReadyState'
import { PlayingState } from '../states/PlayingState'
import { GameOverState } from '../states/GameOverState'
import { PipeFactory } from '../factories/PipeFactory'

export class Game extends Scene {
  protected bird!: Bird
  protected pipes!: Phaser.GameObjects.Group
  protected background!: Phaser.GameObjects.TileSprite
  protected scoreText!: Phaser.GameObjects.BitmapText
  protected startText?: Phaser.GameObjects.Text
  private currentState!: GameState

  constructor () {
    super('Game')
  }

  public setState (newState: GameState): void {
    this.currentState?.exit(this)
    newState.enter(this)
    this.currentState = newState
  }

  public getBird (): Bird {
    return this.bird
  }

  public getPipes (): Phaser.GameObjects.Group {
    return this.pipes
  }

  public getBackground (): Phaser.GameObjects.TileSprite {
    return this.background
  }

  public destroyStartText (): void {
    if (this.startText) {
      this.startText.destroy()
      this.startText = undefined
    }
  }

  public stopPipes (): void {
    Phaser.Actions.Call(
      this.pipes.getChildren(),
      (pipe: Phaser.GameObjects.GameObject) => {
        pipe.body!.velocity.x = 0
      },
      this
    )
  }

  public addNewRowOfPipes (): void {
    // update the score
    const currentScore = this.registry.get('score') + 1
    this.registry.set('score', currentScore)
    this.scoreText.setText(String(currentScore))

    // Create new row of pipes
    const newPipes = PipeFactory.createRow(this, 400)
    this.pipes.addMultiple(newPipes)
  }

  init (): void {
    this.registry.set('score', 0)
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
        '0'
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
        color: '#000000',
        align: 'center'
      }
    ).setOrigin(0.5).setDepth(10)

    this.setState(new ReadyState())

    this.input.on('pointerdown', () => {
      if (this.currentState instanceof ReadyState) {
        this.setState(new PlayingState())
      } else if (this.currentState instanceof PlayingState && !this.bird.getDead()) {
        this.bird.flap()
      } else if (this.currentState instanceof GameOverState) {
        this.scene.restart()
      }
    }, this)
  }

  update (): void {
    this.currentState.update(this)
  }
}
