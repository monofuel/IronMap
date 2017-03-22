
import PingAnimation from './ping';
export {
  PingAnimation
}
export interface Animation {

  update(): void
  draw(ctx: CanvasRenderingContext2D): void
  isComplete(): boolean
}

export interface Vector {
  x: number,
  y: number,
  z?: number
}