export class SimulateTask {
  constructor() {
    this.simulateTask(2000)
      .then((result) => console.log(result))
      .catch((err) => console.error("Lỗi:", err))
      .finally(() => console.log("Kết thúc."));
  }
  private simulateTask(time: number): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("Task done");
      }, time);
    });
  }
}
