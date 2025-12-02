/**
 * @author       Digitsensitive <digit.sensitivee@gmail.com>
 * @copyright    2019 Digitsensitive
 * @description  Flappy Bird: Pipe
 * @license      Digitsensitive
 */

export class Pipe extends Phaser.GameObjects.Image {
  constructor (params: { scene: Phaser.Scene; x: number; y: number; key: string; frame?: number | string }) {
    super(params.scene, params.x, params.y, params.key, params.frame)

    // image
    this.setScale(3)
    this.setOrigin(0, 0)

    // physics
    this.scene.physics.world.enable(this);
    (this.body as Phaser.Physics.Arcade.Body)!.allowGravity = false;
    (this.body as Phaser.Physics.Arcade.Body)!.setVelocityX(-200);
    (this.body as Phaser.Physics.Arcade.Body)!.setSize(20, 20)

    this.scene.add.existing(this)
  }
}
