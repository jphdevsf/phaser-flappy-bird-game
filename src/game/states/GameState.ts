import { Game } from '../scenes/Game'

export abstract class GameState {
  abstract update(scene: Game): void;

  enter (_scene: Game): void {
    // Override in subclasses if needed
    console.log(_scene)
  }

  exit (_scene: Game): void {
    // Override in subclasses if needed
    console.log(_scene)
  }
}
