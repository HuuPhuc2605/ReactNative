import { Swimmable } from "./bai_12_Swimmable";

export class Fish implements Swimmable {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  swimmable(): void {
    console.log(this.name + "đang bơi dưới nước");
  }
}
