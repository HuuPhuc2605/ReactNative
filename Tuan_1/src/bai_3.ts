export class Car{
    brand: string;
    model: string; 
    year: string;

    constructor(brand: string, model: string, year: string){
        this.brand = brand;
        this.model = model;
        this.year = year;
    }
    display(){
        console.log('Thương hiệu: ' + this.brand);
        console.log('Mẫu: ' + this.model);
        console.log('Năm sản xuất: ' + this.year);
    }
 
}
