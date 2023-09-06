export type Method = "GET" | "POST" | "PUT" | "DELETE";

function returnCorrectRequest(method: Method, data: unknown): RequestInit {
  const token = localStorage.getItem("token");
  const request: RequestInit = {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  if (method !== "GET" && method !== "DELETE") {
    request.body = JSON.stringify(data);
  }

  return request;
}

export async function sendApiRequest<T>(
  url: string,
  method: Method,
  data: unknown = {},
): Promise<T> {
  const response = await fetch(url, returnCorrectRequest(method, data));

  if (!response.ok) {
    throw new Error(`An error has occurred: ${response.status}`);
  }

  if (method === "DELETE") {
    return {} as Promise<T>;
  }

  return (await response.json()) as Promise<T>;
}
