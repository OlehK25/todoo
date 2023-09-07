export type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

function returnCorrectRequest(method: Method, data: unknown): RequestInit {
  const token = localStorage.getItem("token");
  const request: RequestInit = {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  if (method !== "GET") {
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
    throw new Error(
      `An error has occurred: ${response.json().then((e) => {
        console.log(e.error);
        return e.error;
      })}`,
    );
  }

  if (method === "DELETE") {
    return {} as Promise<T>;
  }

  return (await response.json()) as Promise<T>;
}
