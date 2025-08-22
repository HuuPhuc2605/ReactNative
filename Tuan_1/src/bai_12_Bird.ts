import { Flyable } from "./bai_12_Flyable";

export class Bird implements Flyable {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  flyable(): void {
    console.log(this.name + "đang bay trên trời");
  }
}
