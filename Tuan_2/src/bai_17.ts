export class IteratePromises {
  async run() {
    console.log("=== Bài 17: for await...of ===");

    const task1 = async () =>
      new Promise<string>((resolve) =>
        setTimeout(() => {
          resolve("Result 1");
        }, 1000)
      );

    const task2 = async () =>
      new Promise<string>((resolve) =>
        setTimeout(() => {
          resolve("Result 2");
        }, 1000)
      );

    const promises = [task1(), task2()];

    for await (const result of promises) {
      console.log(result);
    }
  }
}
