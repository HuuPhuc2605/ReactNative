export class Simulated {
  constructor() {
    Promise.all([
      this.simulatedTask(1, 1000),
      this.simulatedTask(2, 1500),
      this.simulatedTask(3, 2000),
    ])
      .then((ok) => {
        console.log("Tất cả task đã hoàn thành");
        console.log(ok);
      })
      .catch((loi) => console.error("Lỗi: ", loi))
      .finally(() => console.log("Kết thúc"));
  }
  private simulatedTask(id: number, time: number): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("Task " + id + " hoàn thành sau " + time + " ms");
      }, time);
    });
  }
}
