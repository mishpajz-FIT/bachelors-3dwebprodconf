import { t } from "i18next";

export function readParsedJsonFromFile<T>(
  file: File,
  parser: (data: unknown) => T
): Promise<T> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const text = e.target?.result;
        if (text) {
          resolve(parser(JSON.parse(text as string)));
        } else {
          reject(new Error(t("errorMissingText")));
        }
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsText(file);
  });
}
