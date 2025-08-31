export class Random_2 {
  constructor() {
    this.runTask();
  }
  private random(): Promise<string> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const success = Math.random() > 0.5;
        if (success) {
          resolve("Lấy thành công số lớn hơn 0.5");
        } else {
          reject("Không lấy được số lớn hơn 0.5");
        }
      }, 1000);
    });
  }
  private async runTask() {
    try {
      const kq = await this.random();
      console.log(kq);
    } catch (err) {
      console.error("Lỗi:", err);
    }
  }
}
