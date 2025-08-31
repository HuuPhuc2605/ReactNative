"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Random = void 0;
class Random {
    constructor() {
        this.random = new Promise((resolve, reject) => {
            setTimeout(() => {
                const success = Math.random() > 0.4;
                if (success) {
                    resolve(10);
                }
                else {
                    reject("Lỗi không lấy được số");
                }
            }, 1000);
        });
        this.random
            .then(msg => console.log("Thành công: ", msg))
            .catch(err => console.error("Lỗi: ", err))
            .finally(() => console.log("Kết thúc."));
    }
}
exports.Random = Random;
