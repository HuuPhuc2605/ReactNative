export class ArrayPromise {
  constructor() {
    Promise.resolve([1, 2, 3, 4, 5, 6])
      .then((arr) => {
        console.log("Danh sách: ", arr);
        return arr;
      })

      .then((mang) => mang.filter((n) => n % 2 === 0))
      .then((kq) => console.log("Danh sách phần tử chẵn: ", kq))
      .catch((err) => console.error("Lỗi: ", err));
  }
}
