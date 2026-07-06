import axios from "axios";

let logoutHandler = null;

export function registerAuthLogout(handler) {
  logoutHandler = handler;
}

export const API_BASE =
  (process.env.REACT_APP_API_BASE || "http://localhost:5000").replace(/\/+$/, "");

export function apiUrl(path = "") {
  if (!path) return API_BASE;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${normalizedPath}`;
}

function getStoredAuthSession() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

function persistAuthSession(session) {
  localStorage.setItem("user", JSON.stringify(session));
}

function clearStoredAuthSession() {
  localStorage.removeItem("user");
}

export function getStoredAuthToken() {
  const saved = getStoredAuthSession();
  return saved?.token || null;
}

export function getStoredRefreshToken() {
  const saved = getStoredAuthSession();
  return saved?.refreshToken || null;
}

export function authHeaders(extraHeaders = {}) {
  const token = getStoredAuthToken();
  return {
    ...extraHeaders,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

let isRefreshing = false;
let refreshQueue = [];

const processRefreshQueue = (error, newToken = null) => {
  refreshQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(newToken);
    }
  });
  refreshQueue = [];
};

axios.interceptors.request.use((config) => {
  const token = getStoredAuthToken();
  if (token && !config.headers?.Authorization) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;
    const isRefreshRequest = originalRequest?.url?.includes("/api/auth/refresh-token");

    if (error?.response?.status === 401 && !originalRequest?._retry && !isRefreshRequest) {
      originalRequest._retry = true;
      const session = getStoredAuthSession();
      const refreshToken = session?.refreshToken;

      if (!refreshToken) {
        clearStoredAuthSession();
        return Promise.reject(error);
      }

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const response = await axios.post(apiUrl("/api/auth/refresh-token"), { refreshToken });
          const newToken = response?.data?.token;

          if (!newToken) {
            throw new Error("No access token returned");
          }

          const updatedSession = { ...session, token: newToken };
          persistAuthSession(updatedSession);
          processRefreshQueue(null, newToken);
          isRefreshing = false;

          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${newToken}`,
          };
          return axios(originalRequest);
        } catch (refreshError) {
          clearStoredAuthSession();
          processRefreshQueue(refreshError, null);
          isRefreshing = false;
          if (typeof logoutHandler === "function") {
            logoutHandler();
          }
          return Promise.reject(refreshError);
        }
      }

      return new Promise((resolve, reject) => {
        refreshQueue.push({ resolve, reject });
      })
        .then((newToken) => {
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${newToken}`,
          };
          return axios(originalRequest);
        })
        .catch((refreshError) => Promise.reject(refreshError));
    }

    return Promise.reject(error);
  }
);
