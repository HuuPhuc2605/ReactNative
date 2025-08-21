export class Rectangle {
  width: number;
  height: number;
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
  getArea() {
    return this.width * this.height;
  }
  getPerimeter() {
    return (this.width + this.height) * 2;
  }
  display() {
    console.log("Chiều rộng: " + this.width + ", Chiều dài: " + this.height);
    console.log("Diện tích: " + this.getArea());
    console.log("Chu vi: " + this.getPerimeter());
  }
}
