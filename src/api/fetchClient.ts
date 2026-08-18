type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";
type PathParams = Record<string, string | number>;
type QueryParams = Record<string, string | number | boolean | null | undefined>;

interface RequestOptions<TBody> {
  body?: TBody;
  params?: {
    path?: PathParams;
    query?: QueryParams;
  };
}

const API_BASE_URL = "http://localhost:8080";

function buildUrl(path: string, params?: RequestOptions<unknown>["params"]) {
  const resolvedPath = Object.entries(params?.path ?? {}).reduce(
    (currentPath, [key, value]) =>
      currentPath.replace(`:${key}`, encodeURIComponent(String(value))),
    path,
  );

  const url = new URL(resolvedPath, API_BASE_URL);

  Object.entries(params?.query ?? {}).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

async function request<TResponse, TBody = never>(
  method: HttpMethod,
  path: string,
  options: RequestOptions<TBody> = {},
): Promise<TResponse> {
  const response = await fetch(buildUrl(path, options.params), {
    method,
    headers:
      options.body === undefined
        ? undefined
        : { "Content-Type": "application/json" },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    const detail = errorBody ? ` ${errorBody}` : "";

    throw new Error(
      `${method} ${path} failed: ${response.status} ${response.statusText}.${detail}`,
    );
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  return response.json() as Promise<TResponse>;
}

export const fetchClient = {
  GET: <TResponse>(path: string, options?: RequestOptions<never>) =>
    request<TResponse>("GET", path, options),
  POST: <TResponse, TBody>(path: string, options: RequestOptions<TBody>) =>
    request<TResponse, TBody>("POST", path, options),
  PATCH: <TResponse, TBody>(path: string, options: RequestOptions<TBody>) =>
    request<TResponse, TBody>("PATCH", path, options),
  DELETE: <TResponse = void>(path: string, options?: RequestOptions<never>) =>
    request<TResponse>("DELETE", path, options),
};
