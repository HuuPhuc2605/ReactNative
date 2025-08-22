import { Employee } from "./bai_14_Employee";

export class Manager extends Employee {
  constructor(id: string, name: string, age: number, salary: number) {
    super(id, name, age, salary);
  }
  manager() {
    console.log(
      this.name + " là người quản lý có quyền phân công cho các thành viên"
    );
  }
}
