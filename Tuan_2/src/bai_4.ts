export class Random{
    random: Promise<number>;
    constructor(){
        this.random = new Promise<number>((resolve, reject)=>{
            setTimeout(() => {
                const success = Math.random()>0.4;
                if (success) {
                    resolve(10);
                }else{
                    reject("Lỗi không lấy được số");
                }
            }, 1000);
        })
        this.random
            .then(msg=>console.log("Thành công: ", msg))
            .catch(err=>console.error("Lỗi: ", err))
            .finally(()=>console.log("Kết thúc."));
    }
}