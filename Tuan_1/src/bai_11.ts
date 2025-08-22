export class Animal {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  display() {
    console.log("Tên con vật: " + this.name);
  }
}
