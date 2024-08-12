type FetchOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  credentials?: RequestCredentials;
};

export async function fetcher(url: string, options: FetchOptions = {}) {
  const { method = 'GET', headers = {}, body, credentials = 'include' } = options;

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials,
  });

  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage = errorData.message || 'An error occurred';
    throw new Error(errorMessage);
  }

  return response.json();
}