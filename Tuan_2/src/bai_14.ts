export class MultiplyAsync {
  async run(num: number) {
    const kq = await new Promise<number>((resolve) => {
      setTimeout(() => {
        resolve(num * 3);
      }, 1000);
    });
    console.log("Kết quả: " + kq);
    return kq;
  }
}
const app = new MultiplyAsync();
app.run(3);
