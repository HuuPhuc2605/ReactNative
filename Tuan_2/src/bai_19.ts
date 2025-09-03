import { FetchUser } from "./bai_18";

export class FetchUsers {
  async run(ids: number[]) {
    console.log("=== Bài 19: fetchUsers ===");

    const fetchUser = new FetchUser();
    const users = [];

    for (const id of ids) {
      const user = await fetchUser.run(id);
      users.push(user);
    }

    return users;
  }
}
