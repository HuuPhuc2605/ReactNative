export class Book {
  title: string;
  author: string;
  year: number;
  constructor(title: string, author: string, year: number) {
    this.title = title;
    this.author = author;
    this.year = year;
  }
  display() {
    console.log("Tiêu đề: " + this.title);
    console.log("Tác giả: " + this.author);
    console.log("Năm xuất bản: " + this.year);
  }
}
