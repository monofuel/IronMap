import { Animation, Vector } from './';

export default class PingAnimation implements Animation {
  center: Vector;
  color: string;  
  radius: number = 1;

  constructor(center: Vector, color: string = '#550000') {
    this.center = center;
    this.color = color;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI, false);
    ctx.lineWidth = 3;
    ctx.strokeStyle = this.color;
    ctx.stroke();
  }

  update() {
    this.radius += 0.1;
  }

  isComplete(): boolean {
    return this.radius > 20;
  }
}