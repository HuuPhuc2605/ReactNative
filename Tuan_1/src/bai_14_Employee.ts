export class Employee {
  id: string;
  name: string;
  age: number;
  salary: number;
  constructor(id: string, name: string, age: number, salary: number) {
    this.id = id;
    this.name = name;
    this.age = age;
    this.salary = salary;
  }
  display() {
    console.log("Mã nhân viên: " + this.id);
    console.log("Tên nhân viên: " + this.name);
    console.log("Tuổi nhân viên: " + this.age);
    console.log("Lương nhân viên: " + this.salary);
  }
  work() {
    console.log(this.name + " có mức lương là" + this.salary);
  }
}
