import { GameState } from './GameState'
import { Game } from '../scenes/Game'
import { PlayingState } from './PlayingState'

export class ReadyState extends GameState {
  private startKey?: Phaser.Input.Keyboard.Key

  enter (scene: Game): void {
    scene.physics.world.pause()
    this.startKey = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
  }

  update (scene: Game): void {
    if (this.startKey!.isDown) {
      scene.setState(new PlayingState())
    }
  }
}
