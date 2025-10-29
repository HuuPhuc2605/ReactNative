import * as SQLite from "expo-sqlite";

let _db: SQLite.SQLiteDatabase | null = null;

export async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!_db) {
    _db = await SQLite.openDatabaseAsync("shop_v3.db");
    await _db.execAsync("PRAGMA foreign_keys = ON;");
  }
  return _db;
}

export async function ensureSchema() {
  const db = await getDb();

  await db.runAsync(`
    CREATE TABLE IF NOT EXISTS products(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL CHECK(price >= 0),
      stock INTEGER NOT NULL DEFAULT 10
    );
  `);

  await db.runAsync(`
    CREATE TABLE IF NOT EXISTS cart_items(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      unit_price REAL NOT NULL,
      qty INTEGER NOT NULL CHECK(qty > 0),
      line_total REAL NOT NULL,
      UNIQUE(product_id),
      FOREIGN KEY(product_id) REFERENCES products(id)
    );
  `);
  await db.runAsync(`
  CREATE TABLE IF NOT EXISTS orders(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    total REAL NOT NULL DEFAULT 0,
    vat REAL NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

  await db.runAsync(`
  CREATE TABLE IF NOT EXISTS order_items(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    qty INTEGER NOT NULL,
    unit_price REAL NOT NULL,
    line_total REAL NOT NULL,
    FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY(product_id) REFERENCES products(id)
  );
`);
}

export async function run(sql: string, params: any[] = []) {
  const db = await getDb();
  return db.runAsync(sql, params);
}

export async function all<T = any>(sql: string, params: any[] = []) {
  const db = await getDb();
  return db.getAllAsync<T>(sql, params);
}

export async function first<T = any>(sql: string, params: any[] = []) {
  const db = await getDb();
  return db.getFirstAsync<T>(sql, params);
}

export async function withTx<T>(
  fn: (tx: SQLite.SQLiteDatabase) => Promise<T>
): Promise<T> {
  const db = await getDb();
  let result: T;
  await db.withTransactionAsync(async () => {
    result = await fn(db);
  });
  // @ts-ignore
  return result!;
}

export async function seedIfEmpty() {
  const row = await first<{ c: number }>(`SELECT COUNT(*) AS c FROM products;`);
  if ((row?.c ?? 0) > 0) return;

  const samples = [
    { name: "Táo Fuji", price: 35000 },
    { name: "Cam Mỹ", price: 65000 },
    { name: "Mì gói", price: 4500 },
    { name: "Coca Cola", price: 12000 },
  ];
  for (const s of samples) {
    await run(`INSERT INTO products(name, price, stock) VALUES(?,?,10)`, [
      s.name,
      s.price,
    ]);
  }
}
