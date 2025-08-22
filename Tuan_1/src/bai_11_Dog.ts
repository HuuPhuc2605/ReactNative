import { Animal } from "./bai_11";

export class Dog1 extends Animal {
  constructor(name: string) {
    super(name);
  }
  bark() {
    console.log(this.name + " sủa gâu gâu");
  }
}
