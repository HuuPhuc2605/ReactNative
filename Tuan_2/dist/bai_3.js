"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Error = void 0;
class Error {
    constructor() {
        this.errorPromise = new Promise((_, reject) => {
            setTimeout(() => {
                const success = Math.random() > 0.99;
                if (success) {
                    _(10);
                }
                else {
                    reject("Lỗi không lấy được số");
                }
            }, 1000);
        });
        this.errorPromise
            .catch(err => console.error("Lỗi: ", err))
            .finally(() => console.log("Kết thúc."));
    }
}
exports.Error = Error;
