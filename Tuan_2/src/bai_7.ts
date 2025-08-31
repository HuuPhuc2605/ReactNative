export class Race {
  constructor() {
    Promise.race([this.race(1, 1000), this.race(2, 1500), this.race(3, 2000)])
      .then((ok) => {
        console.log("Đã hoàn thành 1 task sớm nhất");
        console.log(ok);
      })
      .catch((loi) => console.error("Lỗi: ", loi))
      .finally(() => console.log("Kết thúc"));
  }
  private race(id: number, time: number): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("Task " + id + " hoàn thành sau " + time + " ms");
      }, time);
    });
  }
}
