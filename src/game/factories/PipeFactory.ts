import { Scene } from 'phaser'
import { Game } from '../scenes/Game'
import { Pipe } from '../../objects/pipe'

const PIPE_CONFIG = {
  SPACING: 60,
  HOLE_SIZE: 3,
  NUM_ROWS: 10,
  HOLE_START_MIN: 1,
  HOLE_START_MAX: 5,
  EDGE_FRAME_TOP: 0,
  EDGE_FRAME_BOTTOM: 1,
  BODY_FRAME: 2
} as const

export class PipeFactory {
  static createPipe (scene: Scene, x: number, y: number, frame: number): Pipe {
    return new Pipe({
      scene,
      x,
      y,
      frame,
      key: 'pipe'
    })
  }

  static createRow (scene: Game, x: number): Pipe[] {
    const pipes: Pipe[] = []
    const hole = Math.floor(Math.random() * (PIPE_CONFIG.HOLE_START_MAX - PIPE_CONFIG.HOLE_START_MIN + 1)) + PIPE_CONFIG.HOLE_START_MIN

    for (let i = 0; i < PIPE_CONFIG.NUM_ROWS; i++) {
      if (i !== hole && i !== hole + 1 && i !== hole + 2) {
        let frame: number = PIPE_CONFIG.BODY_FRAME
        if (i === hole - 1) {
          frame = PIPE_CONFIG.EDGE_FRAME_TOP
        } else if (i === hole + 3) {
          frame = PIPE_CONFIG.EDGE_FRAME_BOTTOM
        }
        const y = i * PIPE_CONFIG.SPACING
        pipes.push(this.createPipe(scene, x, y, frame))
      }
    }

    return pipes
  }
}
