export class HelloAsync {
  async run() {
    const msg = await new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve("Hello Async");
      }, 5000);
    });
    console.log(msg);
  }
}
