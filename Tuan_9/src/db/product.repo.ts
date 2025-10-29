import type { Product } from "../models/types";
import { all, ensureSchema, first, run, seedIfEmpty } from "./db";

export async function initProducts() {
  await ensureSchema();
  await seedIfEmpty();
}

export async function getAllProducts(): Promise<Product[]> {
  return all<Product>(`SELECT * FROM products ORDER BY id`);
}

export async function getProductById(id: number) {
  return first<Product>(`SELECT * FROM products WHERE id=?`, [id]);
}

export async function updateStock(id: number, newStock: number) {
  await run(`UPDATE products SET stock=? WHERE id=?`, [newStock, id]);
}
