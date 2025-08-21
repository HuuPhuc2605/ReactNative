import { Person } from "./bai_1";
export class Student extends Person{
grade: string;
constructor(name: string, age: number, grade: string){
   super(name, age);
   this.grade = grade;
}
display(): void {
    super.display();
    console.log("Cấp bậc" + this.grade);
}
toString(): string {
    return `Tên: ${this.name}, Tuổi: ${this.age}, Lớp: ${this.grade}`;
  }
}