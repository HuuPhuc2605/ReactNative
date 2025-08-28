export class Number{
    number : Promise<number>;
    constructor(){
        this.number = new Promise<number>((resolve)=>{
            setTimeout(() => {
                resolve(10);
            }, 1000);
        });
           this.number
           .then(msg =>console.log("Thành công: ", msg))
            
            .finally(()=>console.log("Kết thúc."));
    }
}