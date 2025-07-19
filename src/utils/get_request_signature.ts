import moment from "moment-timezone/moment-timezone.js";
import crc32 from "crc-32";

moment.tz.add([
  "Asia/Bangkok|LMT BMT +07|-6G.4 -6G.4 -70|012|-3D8SG.4 1C000|15e6",
]);

const getRequestSignature = (
  method: string,
  headers: Record<string, string>,
  body: Record<string, unknown>
): string => {
  const appId = headers["X-APP-ID"];
  if (!appId) {
    throw new Error("X-APP-ID header is required");
  }
  const timeFormat = "YYYY-MM-DD HH:mm:00";
  const timestamp = moment().tz("Asia/Bangkok").format(timeFormat);

  const bodyStr = ["POST", "PUT"].includes(method.toUpperCase())
    ? JSON.stringify(body ?? {})
    : "";

  const dataToHash = bodyStr + appId + timestamp;
  const signature = (crc32.str(dataToHash) >>> 0).toString(16).toUpperCase();

  return signature;
};

export default getRequestSignature;
