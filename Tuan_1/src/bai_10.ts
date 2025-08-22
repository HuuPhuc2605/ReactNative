export class Account {
  public owner: string;
  private balance: number;
  readonly accountNumber: string;
  constructor(owner: string, balance: number, accountNumber: string) {
    this.owner = owner;
    this.balance = balance;
    this.accountNumber = accountNumber;
  }
  deposit(amount: number) {
    if (amount > 0) {
      this.balance += amount;
      console.log(
        "Đã nạp " +
          amount +
          " vào tài khoản thành công. Số dư hiện tại là: " +
          this.balance
      );
    } else console.log("Số tiền nạp vào phải lớn hơn 0");
  }
  withdraw(amount: number) {
    if (amount > this.balance) console.log("Số dư không đủ");
    else {
      this.balance -= amount;
      console.log("Số dư hiện tại trong tài khoản là: " + this.balance);
    }
  }
  getBalance() {
    return this.balance;
  }
  display() {
    console.log("Chủ tài khoản: " + this.owner);
    console.log("Số dư tài khoản: " + this.balance);
    console.log("Số tài khoản: " + this.accountNumber);
  }
}
