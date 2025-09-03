export class ParallelTasks {
  async run() {
    console.log("=== Bài 16: Parallel Tasks ===");

    const task1 = async () =>
      new Promise<string>((resolve) =>
        setTimeout(() => {
          console.log("Task 1 done");
          resolve("Result 1");
        }, 1000)
      );

    const task2 = async () =>
      new Promise<string>((resolve) =>
        setTimeout(() => {
          console.log("Task 2 done");
          resolve("Result 2");
        }, 1000)
      );

    const results = await Promise.all([task1(), task2()]);
    console.log(results);
  }
}
