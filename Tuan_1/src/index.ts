import { Person } from "./bai_1";
import { Student } from "./bai_2";
import { Car } from "./bai_3";
import { Rectangle } from "./bai_4";
  var person1 = new Person('Lê Hữu Phúc', 21);
  var student2 = new Student('Lê Hữu Phúc', 21, 'Sinh viên');
  var car1 = new Car('Future', 'Thể thao', '2022');
  var r1 = new Rectangle(5, 4);
  console.log(person1.toString());
  console.log(student2.toString());
  console.log(car1.display());
  console.log(r1.display());
  
  