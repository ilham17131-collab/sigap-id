window.SIGAP_API = "https://sigap-id.wispbyte.app";

async function sigapFetch(path, options = {}) {
  const url = `${window.SIGAP_API}${path}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Accept": "application/json",
      ...(options.headers || {})
    }
  });

  return response;
}
