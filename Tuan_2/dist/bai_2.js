"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Number = void 0;
class Number {
    constructor() {
        this.number = new Promise((resolve) => {
            setTimeout(() => {
                resolve(10);
            }, 1000);
        });
        this.number
            .then(msg => console.log("Thành công: ", msg))
            .finally(() => console.log("Kết thúc."));
    }
}
exports.Number = Number;
