export class Finally {
  finally: Promise<string>;
  constructor() {
    this.finally = new Promise<string>((resolve, reject) => {
      setTimeout(() => {
        const success = Math.random() > 0.4;
        if (success) {
          resolve("Lấy được số lớn hơn 0.4");
        } else {
          reject("Lỗi không lấy được số");
        }
      }, 1000);
    });
    this.finally
      .then((success) => console.log("Thành công:", success))
      .catch((err) => console.error("Lỗi: ", err))
      .finally(() => console.log("Done"));
  }
}
