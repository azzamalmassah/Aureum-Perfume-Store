const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const TOKEN_KEY = "aureum_token";

async function request(path, { method = "GET", body, headers } = {}) {
  const token = localStorage.getItem(TOKEN_KEY);
  const isForm = body instanceof FormData;
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      ...(isForm ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {}),
    },
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
    credentials: "include",
  });

  const contentType = res.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    const message =
      (payload && payload.message) ||
      (payload && payload.error?.message) ||
      `Request failed: ${res.status} ${res.statusText}`;
    throw new Error(message);
  }

  return payload;
}

export async function getItems() {
  const json = await request("/api/v1/items");
  return json?.data?.data || [];
}

export async function getItemById(id) {
  const json = await request(`/api/v1/items/${id}`);
  return json?.data?.doc || null;
}

export async function createPaymentSession({ provider, items, successUrl, cancelUrl }) {
  const json = await request("/api/v1/payments/session", {
    method: "POST",
    body: { provider, items, successUrl, cancelUrl },
  });
  return json?.data || null;
}

export async function login({ email, password }) {
  const json = await request("/api/v1/users/login", {
    method: "POST",
    body: { email, password },
  });
  return { token: json?.token || null, user: json?.data?.user || null };
}

export async function signup({ name, email, password, passwordConfirm }) {
  const json = await request("/api/v1/users/signup", {
    method: "POST",
    body: { name, email, password, passwordConfirm },
  });
  return { token: json?.token || null, user: json?.data?.user || null };
}

export async function getMe() {
  const json = await request("/api/v1/users/me");
  return json?.data?.data || json?.data?.updatedUser || json?.data?.user || null;
}

export async function createItem(formData) {
  const json = await request("/api/v1/items", {
    method: "POST",
    body: formData,
  });
  return json?.data?.data || null;
}

export async function updateItem(id, formData) {
  const json = await request(`/api/v1/items/${id}`, {
    method: "PATCH",
    body: formData,
  });
  return json?.data?.data || null;
}

export async function deleteItem(id) {
  await request(`/api/v1/items/${id}`, { method: "DELETE" });
  return true;
}

export async function getOrders() {
  const json = await request("/api/v1/orders");
  return json?.data?.orders || [];
}

export async function purchaseItems(items) {
  const json = await request("/api/v1/items/purchase", {
    method: "POST",
    body: { items },
  });
  return json?.data?.items || [];
}

