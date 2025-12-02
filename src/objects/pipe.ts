export class Pipe extends Phaser.GameObjects.Image {
  private static readonly PIPE_VELOCITY = -200
  private static readonly PIPE_SIZE = { width: 20, height: 20 }

  constructor (params: { scene: Phaser.Scene; x: number; y: number; key: string; frame?: number | string }) {
    super(params.scene, params.x, params.y, params.key, params.frame)
    this.setScale(3)
    this.setOrigin(0, 0)
    this.setupPhysics()
    this.scene.add.existing(this)
  }

  private getPhysicsBody (): Phaser.Physics.Arcade.Body | null {
    if (this.body && this.body instanceof Phaser.Physics.Arcade.Body) return this.body as Phaser.Physics.Arcade.Body
    return null
  }

  private setupPhysics (): void {
    this.scene.physics.world.enable(this)
    const physicsBody = this.getPhysicsBody()
    if (!physicsBody) return console.warn('Physics body not initialized for pipe')
    physicsBody.allowGravity = false
    physicsBody.setVelocityX(Pipe.PIPE_VELOCITY)
    physicsBody.setSize(Pipe.PIPE_SIZE.width, Pipe.PIPE_SIZE.height)
  }
}
