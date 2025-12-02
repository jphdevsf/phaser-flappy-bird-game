import { GameState } from './GameState'
import { Game } from '../scenes/Game'

export class GameOverState extends GameState {
  private restartKey?: Phaser.Input.Keyboard.Key

  enter (scene: Game): void {
    scene.stopPipes()
    scene.physics.world.pause()

    // Background box for game over text
    const centerY = scene.sys.canvas.height / 2
    const boxHeight = 164 // Height to cover both texts with padding
    const boxY = centerY - (boxHeight / 2) // Center the box vertically
    const boxWidth = scene.sys.canvas.width
    const graphics = scene.add.graphics()
    graphics.fillStyle(0x000000, 0.75)
    graphics.fillRect(0, boxY, boxWidth, boxHeight)
    graphics.setDepth(9)

    // Texts positioned relative to box like flex children, centered vertically and horizontally
    const spaceBetween = 16
    const gameOverHeight = 48
    const restartHeight = 24
    const totalContentHeight = gameOverHeight + spaceBetween + restartHeight
    const groupPadding = (boxHeight - totalContentHeight) / 2 // 16px top/bottom

    const gameOverY = boxY + groupPadding + (gameOverHeight / 2)
    const restartY = gameOverY + gameOverHeight + spaceBetween - (restartHeight / 2)

    // GAME OVER text
    scene.add.text(
      scene.sys.canvas.width / 2,
      gameOverY,
      'GAME OVER',
      {
        fontFamily: 'Impact',
        fontSize: 48,
        color: '#ff0000',
        align: 'center'
      }
    ).setOrigin(0.5).setDepth(10)
    scene.add.text(
      scene.sys.canvas.width / 2,
      restartY,
      'Tap or press R to restart',
      {
        fontFamily: 'Arial',
        fontSize: 24,
        color: '#ffffff',
        align: 'center'
      }
    ).setOrigin(0.5).setDepth(10)
    this.restartKey = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.R)
  }

  update (scene: Game): void {
    if (this.restartKey?.isDown) {
      scene.scene.restart()
    }
  }
}
