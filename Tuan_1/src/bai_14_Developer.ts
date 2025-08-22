import { Employee } from "./bai_14_Employee";

export class Developer extends Employee {
  constructor(id: string, name: string, age: number, salary: number) {
    super(id, name, age, salary);
  }
  developer() {
    console.log(this.name + " là thực hiện công việc");
  }
}
