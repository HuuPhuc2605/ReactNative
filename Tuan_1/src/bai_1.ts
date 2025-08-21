export class Person{
    name: string;
    age: number;
    constructor(name: string, age: number){
        this.name = name;
        this.age = age;
    }
    display(){
        console.log('Tên: ' + this.name);
        console.log('Tuổi: ' + this.age);
    }
    toString(): string {
        return `Tên: ${this.name}, Tuổi: ${this.age}`;
      }
}

