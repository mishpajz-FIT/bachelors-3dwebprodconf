import { t } from "i18next";

export async function fetchParsedJson<T>(
  url: string,
  parser: (data: unknown) => T
): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(t("errorNetwork", { status: response.status }));
  }

  return parser(await response.json());
}
