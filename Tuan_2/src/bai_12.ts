export class SimulateTask_2 {
  constructor() {
    this.runTask();
  }
  private simulateTask(time: number): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("Task done");
      }, time);
    });
  }
  private async runTask() {
    const kq = await this.simulateTask(2000);
    console.log(kq);
  }
}
