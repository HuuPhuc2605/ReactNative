export class FetchUser {
  async run(id: number) {
    const fetchUser = async (id: number) => {
      return new Promise<{ id: number; name: string }>((resolve) =>
        setTimeout(() => {
          resolve({ id, name: `User ${id}` });
        }, 1000)
      );
    };

    const user = await fetchUser(id);
    console.log(user);
    return user;
  }
}
