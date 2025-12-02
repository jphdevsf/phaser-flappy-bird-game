import { GameState } from './GameState'
import { Game } from '../scenes/Game'
import { GameOverState } from './GameOverState'

export class PlayingState extends GameState {
  private timer?: Phaser.Time.TimerEvent

  enter (scene: Game): void {
    scene.destroyStartText()
    scene.physics.world.resume()

    scene.physics.add.overlap(scene.getBird(), scene.getPipes(), () => {
      scene.getBird().setDead(true)
      scene.setState(new GameOverState())
    })

    scene.addNewRowOfPipes()

    this.timer = scene.time.addEvent({
      delay: 1500,
      callback: scene.addNewRowOfPipes,
      callbackScope: scene,
      loop: true
    })
  }

  exit (): void {
    if (this.timer) {
      this.timer.remove()
    }
  }

  update (scene: Game): void {
    scene.getBackground().tilePositionX += 4
    scene.getBird().update()
    if (scene.getBird().getDead()) {
      scene.setState(new GameOverState())
    }
  }
}
