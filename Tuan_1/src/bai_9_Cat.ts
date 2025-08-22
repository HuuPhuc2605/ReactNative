import { Animal } from "./bai_9";
export class Cat implements Animal {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  sound(): void {
    console.log(this.name + "kêu: Meo meo.");
  }
}
