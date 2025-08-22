export class Product {
  name: string;
  price: number;
  constructor(name: string, price: number) {
    this.name = name;
    this.price = price;
  }
  display() {
    console.log("Tên: " + this.name);
    console.log("Giá: " + this.price);
  }
}
