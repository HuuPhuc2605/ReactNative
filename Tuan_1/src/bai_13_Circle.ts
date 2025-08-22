import { Shape } from "./bai_13_Shape";

export class Circle extends Shape {
  radius: number;

  constructor(radius: number) {
    super();
    this.radius = radius;
  }
  area(): number {
    return this.radius * this.radius * 3.14;
  }
}
