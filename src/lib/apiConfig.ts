const DEFAULT_BACKEND_ORIGIN = "http://127.0.0.1:5000";

export function getBackendOrigin() {
  const configuredOrigin = import.meta.env.VITE_API_URL?.toString().trim();
  if (configuredOrigin) {
    return configuredOrigin.replace(/\/api\/?$/, "");
  }

  if (typeof window !== "undefined" && window.location.protocol === "file:") {
    return DEFAULT_BACKEND_ORIGIN;
  }

  return DEFAULT_BACKEND_ORIGIN;
}

export function getApiBaseUrl() {
  return `${getBackendOrigin()}/api`;
}
