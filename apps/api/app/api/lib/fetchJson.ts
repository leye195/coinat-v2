export class FetchJsonError extends Error {
  status: number;
  statusText: string;
  body: unknown;

  constructor(response: Response, body: unknown) {
    super(`Request failed with status ${response.status}`);
    this.status = response.status;
    this.statusText = response.statusText;
    this.body = body;
  }
}

export async function fetchJson<T>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(input, init);
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new FetchJsonError(response, data);
  }
  return data as T;
}
