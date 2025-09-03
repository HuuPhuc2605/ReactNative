export class SequentialTasks {
  async run() {
    console.log("=== Bài 15: Sequential Tasks ===");

    const task1 = async () => {
      return new Promise<string>((resolve) =>
        setTimeout(() => {
          console.log("Task 1 done");
          resolve("Result 1");
        }, 1000)
      );
    };

    const task2 = async () => {
      return new Promise<string>((resolve) =>
        setTimeout(() => {
          console.log("Task 2 done");
          resolve("Result 2");
        }, 1000)
      );
    };

    const r1 = await task1();
    console.log(r1);
    const r2 = await task2();
    console.log(r2);
  }
}
