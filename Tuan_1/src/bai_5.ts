export class BankAccount {
  balance: number;
  constructor(balance: number) {
    this.balance = balance;
  }
  getDeposit(amount: number) {
    if (amount > 0) {
      this.balance += amount;
      console.log(
        "Gửi " +
          amount +
          "đ" +
          " thành công. Số dư hiện tại là: " +
          this.balance +
          "đ"
      );
    } else {
      console.log("Số tiền gửi phải lớn hơn 0");
    }
  }
  getWithdraw(amount: number) {
    if (amount > this.balance) {
      console.log(
        "Số dư của bạn chỉ còn " + this.balance + "đ" + ". Không đủ để rút"
      );
    } else {
      this.balance -= amount;
      console.log("Số tiền còn lại trong tài khoản là " + this.balance + "đ");
    }
  }
  displayBalance() {
    console.log("Số dư hiện tại " + this.balance + "đ");
  }
}
