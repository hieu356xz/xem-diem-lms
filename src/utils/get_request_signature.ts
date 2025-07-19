import moment from "moment";
import crc32 from "crc-32";

const getRequestSignature = (
  method: string,
  headers: Record<string, string>,
  body: Record<string, any>
): string => {
  const appId = headers["X-APP-ID"];
  if (!appId) {
    throw new Error("X-APP-ID header is required");
  }
  const timeFormat = "YYYY-MM-DD HH:mm:00";
  const timestamp = moment().format(timeFormat);

  const bodyStr = ["POST", "PUT"].includes(method.toUpperCase())
    ? JSON.stringify(body ?? {})
    : "";

  const dataToHash = bodyStr + appId + timestamp;
  const signature = (crc32.str(dataToHash) >>> 0).toString(16).toUpperCase();

  return signature;
};

export default getRequestSignature;
