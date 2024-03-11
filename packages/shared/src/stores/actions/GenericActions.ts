export class GenericActions {
  protected static get<T>(
    id: string,
    from: Record<string, T>,
    name: string
  ): T {
    const element = from[id];
    if (!element) {
      throw new Error(`${name} ${id} does not exist.`);
    }
    return element;
  }
}
