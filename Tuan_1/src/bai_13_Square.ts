import { Shape } from "./bai_13_Shape";

export class Square extends Shape {
  edge: number;

  constructor(edge: number) {
    super();
    this.edge = edge;
  }
  area(): number {
    return this.edge * this.edge;
  }
}
