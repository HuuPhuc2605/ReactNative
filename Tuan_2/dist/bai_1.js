"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hello = void 0;
class Hello {
    constructor() {
        this.helloPromise = new Promise((resolve) => {
            setTimeout(() => {
                resolve("Hello Async");
            }, 2000);
        });
        this.helloPromise
            .then(msg => console.log("Thành công: ", msg))
            .finally(() => console.log("Kết thúc."));
    }
}
exports.Hello = Hello;
