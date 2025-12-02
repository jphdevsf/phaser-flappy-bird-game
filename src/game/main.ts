import { Game as MainGame } from './scenes/Game'
import { Game, Types } from 'phaser'

const config: Types.Core.GameConfig = {
  width: 390,
  height: 600,
  parent: 'game',
  scene: [MainGame],
  input: {
    keyboard: true
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 300 },
      debug: false
    }
  },
  render: { pixelArt: true }
}

const StartGame = (parent: string) => {
  return new Game({ ...config, parent })
}

export default StartGame
