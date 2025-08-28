export class Error{
    errorPromise: Promise<number>;
    constructor(){
        this.errorPromise = new Promise<number>((_, reject)=>{
            setTimeout(() => {
                const success = Math.random()>0.99;
                if (success) {
                    _(10);
                }else{
                    reject("Lỗi không lấy được số");
                }
            }, 1000);
        })
        this.errorPromise
        
            .catch(err=>console.error("Lỗi: ", err))
            .finally(()=>console.log("Kết thúc."));
    }
}