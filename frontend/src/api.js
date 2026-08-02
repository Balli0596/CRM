const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = JSON.stringify(body);
    } catch {
      // response had no JSON body
    }
    throw new Error(`${res.status} ${detail}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  listTickets: (params = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v)
    ).toString();
    return request(`/tickets${query ? `?${query}` : ""}`);
  },
  getTicket: (ticketId) => request(`/tickets/${ticketId}`),
  createTicket: (data) =>
    request("/tickets", { method: "POST", body: JSON.stringify(data) }),
  updateTicket: (ticketId, data) =>
    request(`/tickets/${ticketId}`, { method: "PUT", body: JSON.stringify(data) }),
};
