export type OrderItem = {
  title: string;
  price: number;
  qty: number;
};

export type Order = {
  id: number;
  userId: number;
  items: OrderItem[];
  total: number;
  createdAt: string;
};

type CreateOrderPayload = {
  items: OrderItem[];
  total: number;
};

const API_URL = "/api";

export const createOrder = async (
  payload: CreateOrderPayload,
  token: string
): Promise<Order> => {
  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Bestellung fehlgeschlagen");
  }

  return response.json();
};

export const getOrders = async (token: string): Promise<Order[]> => {
  const response = await fetch(`${API_URL}/orders/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Bestellungen konnten nicht geladen werden");
  }

  return response.json();
};
