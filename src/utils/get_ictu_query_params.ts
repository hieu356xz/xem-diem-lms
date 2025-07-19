const getICTUQueryParams = (
  url: string
): Record<string, string | null> | null => {
  const methods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"];

  // Check if the URL starts with one of the HTTP methods
  if (methods.some((method) => url.startsWith(method))) {
    try {
      const rawUrl = url.split(" ")[1];
      const params = new URLSearchParams(rawUrl);

      // Object for storing conditions key-value pairs
      const conditions: Record<string, string | null> = {};

      for (const [key, value] of params.entries()) {
        if (key.startsWith("condition[") && key.endsWith("][key]")) {
          const id = key.match(/\d+/);
          if (id) {
            const conditionKey = value;
            const conditionValue = params.get(`condition[${id[0]}][value]`);

            conditions[conditionKey] = conditionValue || null;
          }
        }
      }

      return conditions;
    } catch (error) {
      console.error("Error processing URL:", error);
      return null;
    }
  }

  return null;
};

export default getICTUQueryParams;
