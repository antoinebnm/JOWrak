/**
 * Custom fetch method
 * @param {string} url      URI element
 * @param {object} body     Body object
 * @param {string} method   POST | GET | PUT | DELETE
 * @param {object} headers  Request headers
 * @returns Json argument
 *
 * Examples:
 * ```js
 *    const data = await fetchData('/api/users', undefined, 'GET', undefined);
 *    fetchData('/api/users', undefined, 'GET', undefined).then(callback);
 * ```
 */
export default async function fetchData(
  url = "/",
  body = undefined,
  method = "POST",
  headers = {}
) {
  try {
    headers["Content-Type"] = "application/json";
    const response = await fetch(`${url}`, {
      method: method,
      headers: headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new TypeError("No JSON tranmitted!");
    }
    const json = await response.json();

    return json;
  } catch (error) {
    return error;
  }
}
