export class Calculate {
  constructor() {
    Promise.resolve(2)
      .then((n) => n * n)
      .then((n) => n * 2)
      .then((n) => n + 5)

      .then((result) => console.log("Kết quả: ", result))
      .catch((err) => console.error("Lỗi", err));
  }
}
