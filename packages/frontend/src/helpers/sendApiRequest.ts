type Method = "GET" | "POST" | "PUT" | "DELETE";

function returnCorrectRequest(method: Method, data: unknown): RequestInit {
  if (method === "GET") {
    return {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };
  }

  if (method === "DELETE") {
    return {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };
  }

  return {
    method,
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  };
}

export async function sendApiRequest<T>(
  url: string,
  method: Method,
  data: unknown = {},
): Promise<T> {
  const response = await fetch(url, returnCorrectRequest(method, data));

  if (!response.ok) {
    throw new Error(`An error has occured: ${response.status}`);
  }

  if (method === "DELETE") {
    return {} as Promise<T>;
  }

  return (await response.json()) as Promise<T>;
}
