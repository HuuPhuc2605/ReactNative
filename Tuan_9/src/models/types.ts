export type Product = {
  id: number;
  name: string;
  price: number;
  unit?: string;
  stock: number;
};

export type CartItem = {
  id: number;
  product_id: number;
  name: string;
  qty: number;
  unit_price: number;
  line_total: number;
};

export const formatCurrency = (num: number) =>
  num.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
