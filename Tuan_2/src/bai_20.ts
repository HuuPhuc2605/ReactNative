export class FetchUserWithTimeout {
  async run(id: number) {
    console.log("=== Bài 20: fetchUserWithTimeout ===");

    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), 2000)
    );

    const apiCall = new Promise<{ id: number; name: string }>((resolve) =>
      setTimeout(() => resolve({ id, name: `User ${id}` }), 3000)
    );

    try {
      const result = await Promise.race([apiCall, timeout]);
      console.log(result);
      return result;
    } catch (err) {
      console.error("Error:", err);
      throw err;
    }
  }
}
