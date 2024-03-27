import { t } from "i18next";

export class GenericActions {
  protected static get<T>(
    id: string,
    from: Record<string, T>,
    name: string
  ): T {
    const element = from[id];
    if (!element) {
      throw new Error(t("errorDoesNotExist", { what: name, id: id }));
    }
    return element;
  }
}
