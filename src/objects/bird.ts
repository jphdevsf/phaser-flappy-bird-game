interface BirdState {
  handleUpdate (bird: Bird): void
}

class AliveState implements BirdState {
  handleUpdate (bird: Bird): void {
    if (bird.jumpKey.isDown) {
      bird.changeState(bird.flappingState)
      new JumpCommand(bird).execute()
    }
    bird.updateAngle()
    bird.checkBounds()
  }
}

class FlappingState implements BirdState {
  handleUpdate (bird: Bird): void {
    bird.updateAngle()
    bird.checkBounds()
    if (bird.jumpKey.isUp) {
      bird.changeState(bird.aliveState)
    }
  }
}

class DeadState implements BirdState {
  handleUpdate (bird: Bird): void {
    bird.updateAngle()
  }
}

class JumpCommand {
  private bird: Bird

  constructor (bird: Bird) {
    this.bird = bird
  }

  execute (): void {
    (this.bird.body as Phaser.Physics.Arcade.Body)!.setVelocityY(Bird.CONFIG.JUMP_VELOCITY)
    this.bird.scene.tweens.add({
      targets: this.bird,
      props: { angle: Bird.CONFIG.MIN_ANGLE },
      duration: Bird.CONFIG.TWEEN_DURATION,
      ease: Bird.CONFIG.EASE
    })
  }
}

export class Bird extends Phaser.GameObjects.Sprite {
  public static readonly CONFIG = {
    GRAVITY_Y: 1000,
    JUMP_VELOCITY: -350,
    MAX_ANGLE: 30,
    ANGLE_INCREMENT: 2,
    MIN_ANGLE: -20,
    TWEEN_DURATION: 150,
    EASE: 'Power0' as const,
    SCALE: 3,
    BODY_WIDTH: 17,
    BODY_HEIGHT: 12
  }

  constructor (params: { scene: Phaser.Scene; x: number; y: number; key: string; frame?: number | string }) {
    super(params.scene, params.x, params.y, params.key, params.frame)
    this.setScale(Bird.CONFIG.SCALE)
    this.setOrigin(0, 0)
    this.isDead = false
    this.setupPhysics()
    this.jumpKey = this.scene.input!.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    this.scene.add.existing(this as Phaser.GameObjects.Sprite)
    this.currentState = this.aliveState
  }

  private getPhysicsBody (): Phaser.Physics.Arcade.Body | null {
    if (this.body && this.body instanceof Phaser.Physics.Arcade.Body) return this.body as Phaser.Physics.Arcade.Body
    return null
  }

  private setupPhysics (): void {
    this.scene.physics.world.enable(this as Phaser.GameObjects.Sprite)
    const physicsBody = this.getPhysicsBody()
    if (!physicsBody) return console.warn('Physics body not initialized for bird')
    physicsBody.setGravityY(Bird.CONFIG.GRAVITY_Y)
    physicsBody.setSize(Bird.CONFIG.BODY_WIDTH, Bird.CONFIG.BODY_HEIGHT)
  }

  // === Physics & Input ===
  public jumpKey: Phaser.Input.Keyboard.Key
  private isDead: boolean

  // === State Machine ===
  public aliveState = new AliveState()
  public flappingState = new FlappingState()
  public deadState = new DeadState()
  private currentState: BirdState

  public getDead (): boolean {
    return this.isDead
  }

  public setDead (dead: boolean): void {
    this.isDead = dead
    this.changeState(dead ? this.deadState : this.aliveState)
  }

  public changeState (state: BirdState): void {
    this.currentState = state
    if (state === this.deadState) {
      this.isDead = true
    }
  }

  public flap (): void {
    if (this.currentState === this.aliveState) {
      this.changeState(this.flappingState)
      new JumpCommand(this).execute()
    }
  }

  public updateAngle (): void { if (this.angle < Bird.CONFIG.MAX_ANGLE) this.angle += Bird.CONFIG.ANGLE_INCREMENT }

  public checkBounds (): void { if (this.y + this.height > this.scene.sys.canvas.height) this.changeState(this.deadState) }

  update (): void { this.currentState.handleUpdate(this) }
}
