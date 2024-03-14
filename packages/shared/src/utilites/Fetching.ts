export async function fetchParsedJson<T>(
  url: string,
  parser: (data: unknown) => T
): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Network error! Status: ${response.status}`);
  }

  return parser(await response.json());
}
