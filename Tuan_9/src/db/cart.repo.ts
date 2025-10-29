import type { CartItem } from "../models/types";
import { all, first, run, withTx } from "./db";
import { getProductById } from "./product.repo";

/** Lấy tất cả item trong giỏ */
export async function getCartItems(): Promise<CartItem[]> {
  return all<CartItem>(`SELECT * FROM cart_items ORDER BY id`);
}

/** Thêm sản phẩm vào giỏ (nếu có thì tăng 1, nhưng không vượt tồn kho) */
export async function addToCart(product_id: number) {
  const p = await getProductById(product_id);
  if (!p) throw new Error("Sản phẩm không tồn tại.");

  // ⚠️ Kiểm tra tồn kho = 0
  if (p.stock <= 0) {
    throw new Error(`Sản phẩm "${p.name}" đã hết hàng.`);
  }

  const existing = await first<{ id: number; qty: number }>(
    `SELECT id, qty FROM cart_items WHERE product_id=?`,
    [product_id]
  );

  const line_total = p.price;

  await withTx(async (db) => {
    if (existing) {
      // Đã có trong giỏ => tăng số lượng
      const newQty = existing.qty + 1;

      // ⚠️ Kiểm tra vượt tồn kho
      if (newQty > p.stock) {
        throw new Error(
          `Không thể thêm. Tồn kho của "${p.name}" chỉ còn ${p.stock}.`
        );
      }

      await db.runAsync(
        `UPDATE cart_items
         SET qty=?, line_total=qty*unit_price
         WHERE id=?`,
        [newQty, existing.id]
      );
    } else {
      // Thêm mới 1 dòng giỏ hàng
      await db.runAsync(
        `INSERT INTO cart_items(product_id, name, qty, unit_price, line_total)
         VALUES (?, ?, ?, ?, ?)`,
        [p.id, p.name, 1, p.price, line_total]
      );
    }
  });
}

/** Cập nhật số lượng */
export async function updateQty(product_id: number, qty: number) {
  const item = await first<CartItem>(
    `SELECT unit_price FROM cart_items WHERE product_id=?`,
    [product_id]
  );
  const p = await getProductById(product_id);
  if (!p) return;
  if (p.stock && qty > p.stock)
    throw new Error(`Không đủ hàng! Tồn kho: ${p.stock}`);

  if (qty <= 0) {
    await run(`DELETE FROM cart_items WHERE product_id=?`, [product_id]);
  } else if (item) {
    const total = qty * item.unit_price;
    await run(`UPDATE cart_items SET qty=?, line_total=? WHERE product_id=?`, [
      qty,
      total,
      product_id,
    ]);
  }
}

/** Xóa item */
export async function deleteItem(product_id: number) {
  await run(`DELETE FROM cart_items WHERE product_id=?`, [product_id]);
}

/** Lấy danh sách hóa đơn */
export async function getInvoiceItems(): Promise<CartItem[]> {
  return all<CartItem>(`SELECT * FROM cart_items ORDER BY id`);
}

export async function checkout() {
  const items = await getCartItems();
  if (items.length === 0) return;

  await withTx(async (db) => {
    // Tính tổng & VAT
    const total = items.reduce((sum, i) => sum + i.line_total, 0);
    const vat = total * 0.1;

    // Lưu vào bảng orders
    const result = await db.runAsync(
      `INSERT INTO orders(total, vat) VALUES(?, ?)`,
      [total, vat]
    );
    const orderId = result.lastInsertRowId;

    // Lưu từng item
    for (const it of items) {
      await db.runAsync(
        `INSERT INTO order_items(order_id, product_id, name, qty, unit_price, line_total)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [orderId, it.product_id, it.name, it.qty, it.unit_price, it.line_total]
      );

      // Cập nhật tồn kho
      const p = await getProductById(it.product_id);
      if (p) {
        const newStock = Math.max(0, (p.stock ?? 0) - it.qty);
        await db.runAsync(`UPDATE products SET stock=? WHERE id=?`, [
          newStock,
          it.product_id,
        ]);
      }
    }

    // Xóa giỏ
    await db.runAsync(`DELETE FROM cart_items`);
  });
}
