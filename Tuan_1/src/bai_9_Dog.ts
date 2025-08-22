import { Animal } from "./bai_9";
export class Dog implements Animal {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  sound(): void {
    console.log(this.name + "sủa: Gâu gâu.");
  }
}
