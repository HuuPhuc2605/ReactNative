export class Hello{
    helloPromise :  Promise<string>;
    constructor(){
        this.helloPromise = new Promise<string>((resolve)=>{
        setTimeout(() => {
            resolve("Hello Async");
        }, 2000);
    });
    
    this.helloPromise
    .then(msg =>console.log("Thành công: ", msg))
     
     .finally(()=>console.log("Kết thúc."));
}
}