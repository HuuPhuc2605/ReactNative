import { Animal } from "./bai_11";

export class Cat1 extends Animal {
  constructor(name: string) {
    super(name);
  }
  meow() {
    console.log(this.name + " kêu meo meo");
  }
}
