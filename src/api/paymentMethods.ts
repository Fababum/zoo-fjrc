export type PaymentMethod = {
  id: number;
  userId: number;
  cardType: string;
  last4: string;
  expMonth: number;
  expYear: number;
  firstName: string;
  lastName: string;
  street: string;
  houseNumber: string;
  addressExtra: string;
  postalCode: string;
  city: string;
  country: string;
  phone: string;
};

type CreatePaymentMethodPayload = Omit<PaymentMethod, "id" | "userId">;
type UpdatePaymentMethodPayload = Partial<CreatePaymentMethodPayload>;

const API_URL = "/api";

export const getPaymentMethods = async (
  token: string
): Promise<PaymentMethod[]> => {
  const response = await fetch(`${API_URL}/payment-methods/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("UNAUTHORIZED");
    }
    throw new Error("Zahlungsmethoden konnten nicht geladen werden");
  }

  return response.json();
};

export const createPaymentMethod = async (
  payload: CreatePaymentMethodPayload,
  token: string
): Promise<PaymentMethod> => {
  const response = await fetch(`${API_URL}/payment-methods`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("UNAUTHORIZED");
    }
    throw new Error("Zahlungsmethode konnte nicht gespeichert werden");
  }

  return response.json();
};

export const updatePaymentMethod = async (
  id: number,
  payload: UpdatePaymentMethodPayload,
  token: string
): Promise<PaymentMethod> => {
  const response = await fetch(`${API_URL}/payment-methods/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("UNAUTHORIZED");
    }
    throw new Error("Zahlungsmethode konnte nicht aktualisiert werden");
  }

  return response.json();
};

export const deletePaymentMethod = async (
  id: number,
  token: string
): Promise<void> => {
  const response = await fetch(`${API_URL}/payment-methods/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("UNAUTHORIZED");
    }
    throw new Error("Zahlungsmethode konnte nicht gelöscht werden");
  }
};
