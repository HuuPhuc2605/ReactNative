import { Person } from "./bai_1";
import { Student } from "./bai_2";
import { Car } from "./bai_3";
import { Rectangle } from "./bai_4";
import { BankAccount } from "./bai_5";
import { Book } from "./bai_6";
import { User } from "./bai_7";
import { Product } from "./bai_8";
import { Dog } from "./bai_9_Dog";
import { Cat } from "./bai_9_Cat";
import { Account } from "./bai_10";
import { Dog1 } from "./bai_11_Dog";
import { Cat1 } from "./bai_11_Cat";
import { Bird } from "./bai_12_Bird";
import { Fish } from "./bai_12_Fish";
import { Square } from "./bai_13_Square";
import { Circle } from "./bai_13_Circle";
import { Manager } from "./bai_14_Manager";
import { Developer } from "./bai_14_Developer";
// //Bài 1
// var person1 = new Person("Lê Hữu Phúc", 21);
// //Bài 2
// var student2 = new Student("Lê Hữu Phúc", 21, "Sinh viên");
// //Bài 3
// var car1 = new Car("Future", "Thể thao", "2022");
// //Bài 4
// var r1 = new Rectangle(5, 4);
// //Bài 5
// var acc = new BankAccount(1000);
// //Bài 6
// var b = new Book("Tâm lý", "Lê Hữu", 2020);
// //Bài 7
// var user = new User("Lê Hữu Phúc");
// //Bài 8
// var products: Product[] = [
//   new Product("Táo", 50),
//   new Product("Ổi", 150),
//   new Product("Cam", 90),
//   new Product("Đào", 250),
// ];
// var filter = products.filter((p) => p.price > 100);
// // Bài 9
// var d = new Dog("Con chó ");
// var c = new Cat("Con mèo ");
// Bài 10
// var acc2 = new Account("Lê Hữu Phúc", 500000, "1028755489");
// Bài 11
// var dog = new Dog1("Chó");
// var cat = new Cat1("Mèo");
// Bài 12
// var b = new Bird("Chim ");
// var f = new Fish("Cá ");
//Bài 13
// var s = new Square(5);
// var c = new Circle(5);
//Bài 14
var m = new Manager("22713601", "Lê Hữu Phúc", 21, 300000);
var d = new Developer("22713600", "Lê Hữu ", 22, 200000);
// console.log("Bài 1----Thông tin----");
// console.log(person1.toString());
// console.log("Bài 2----Thông tin sinh viên----");
// console.log(student2.toString());
// console.log("Bài 3----Xe máy----");
// car1.display();
// console.log("Bài 4----Hình chữ nhật----");
// r1.display();
// console.log("Bài 5----Tài khoản ngân hàng----");
// acc.displayBalance();
// acc.getDeposit(500);
// acc.getWithdraw(200);
// acc.getWithdraw(2000);
// console.log("Bài 6----Thông tin sách----");
// b.display();
// console.log("Bài 7----Thông tin tên----");
// user.display();
// console.log("Bài 8----Danh sách tất cả sản phẩm----");
// products.forEach((p) => p.display());
// console.log("Bài 8----Danh sách sản phẩm trên 100----");
// filter.forEach((p) => p.display());
// console.log("Bài 9----Tiếng kêu các loài động vật----");
// d.sound();
// c.sound();
// console.log("Bài 10----Thông tin tài khoản----");
// acc2.display();
// acc2.deposit(4000);
// acc2.withdraw(300);
// acc2.owner = "Hữu Phúc";
// acc2.display();
// console.log("Bài 11----Thông tin thú nuôi----");
// dog.display();
// dog.bark();
// cat.display();
// cat.meow();
// console.log("Bài 12----Thông tin con vật----");
// b.flyable();
// f.swimmable();
// console.log("Bài 13----Tính diện tích----");
// console.log("Diện tích hình vuông với cạnh " + s.edge + " là: " + s.area());
// console.log(
//   "Diện tích hình tròn với bán kính " + c.radius + " là: " + c.area()
// );
console.log("Bài 14----Danh sách nhân viên----");
m.display();
m.manager();
d.display();
d.developer();
