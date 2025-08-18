import {
  clearSession,
  getTokens,
  updateSessionItem,
} from "../utils/permission";

// === Constants ===
const API_URL = `${import.meta.env.VITE_API}`;

const HTTP_STATUS = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// === Custom Error Classes ===
class APIError extends Error {
  constructor(message, status, response) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.response = response;
  }
}

class TokenExpiredError extends APIError {
  constructor(message = "Token expired") {
    super(message, HTTP_STATUS.UNAUTHORIZED);
    this.name = "TokenExpiredError";
  }
}

class NetworkError extends Error {
  constructor(message = "Network error") {
    super(message);
    this.name = "NetworkError";
  }
}

const createHeaders = (tokens = {}, isFormData = false) => {
  const headers = {};
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  if (tokens?.access) {
    headers["Authorization"] = `Bearer ${tokens.access}`;
  }
  return headers;
};

// === Token Handling ===
const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) throw new TokenExpiredError("No refresh token available");

  try {
    const response = await fetch(`${API_URL}auth/token/refresh/`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify({ refresh: refreshToken }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new APIError(
        data.message || "Failed to refresh token",
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new NetworkError(error.message);
  }
};

const updateTokensInSession = (newTokens) => {
  if (newTokens.access) updateSessionItem("access", newTokens.access);
  if (newTokens.refresh) updateSessionItem("refresh", newTokens.refresh);
};

// === Session Handling ===
const handleSessionExpiration = () => {
  clearSession();
  

  setTimeout(() => {
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  }, 100);
};

// === Response Handler ===
const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));

  if (response.ok) return data;

  switch (response.status) {
    case HTTP_STATUS.UNAUTHORIZED:
      throw new TokenExpiredError(data.message || "Token expired");

    case HTTP_STATUS.FORBIDDEN:
      handleSessionExpiration();
      throw new APIError("Access forbidden", response.status, data);

    default:
      throw new APIError(
        data.message || response.statusText || "Request failed",
        response.status,
        data
      );
  }
};

// === Fetch Wrapper ===
const fetchWithAuth = async (url, options = {}, isRetry = false) => {
  const tokens = getTokens();
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...createHeaders(tokens, isFormData),
    ...options.headers,
  };
  // const headers = {
  //   ...createHeaders(tokens),
  //   ...options.headers,
  // };

  let finalUrl = url;
  // Check if URL is already complete
  if (url.startsWith("http")) {
    finalUrl = url; // Use as is for full URLs
  } else {
    // Add base URL for relative paths
    finalUrl = `${import.meta.env.VITE_API}${url}`;
  }

  try {
    const response = await fetch(`${finalUrl}`, {
      ...options,
      headers,
    });

    return await handleResponse(response);
  } catch (error) {
    // Attempt token refresh
    if (error instanceof TokenExpiredError && !isRetry && tokens?.refresh) {
      try {
        const newTokens = await refreshAccessToken(tokens.refresh);
        updateTokensInSession(newTokens);
        return fetchWithAuth(url, options, true);
      } catch (refreshError) {
        if (
          refreshError instanceof APIError &&
          refreshError.status === HTTP_STATUS.UNAUTHORIZED
        ) {
          handleSessionExpiration();
        }
        throw refreshError;
      }
    }
    throw error;
  }
};

// === HTTP Method Shortcuts ===
const apiService = {
  get: (url, options = {}) => fetchWithAuth(url, { ...options, method: "GET" }),

  post: (url, data, options = {}) => {
    const isFormData = data instanceof FormData;
    return fetchWithAuth(url, {
      ...options,
      method: "POST",
      // body: JSON.stringify(data),
      body: isFormData ? data : JSON.stringify(data),
    });
  },

  put: (url, data, options = {}) => {
    const isFormData = data instanceof FormData;
    return fetchWithAuth(url, {
      ...options,
      method: "PUT",
      body: isFormData ? data : JSON.stringify(data),
    });
  },

  patch: (url, data, options = {}) => {
    const isFormData = data instanceof FormData;
    return fetchWithAuth(url, {
      ...options,
      method: "PATCH",
      body: isFormData ? data : JSON.stringify(data),
    });
  },

  delete: (url, options = {}) => {
    fetchWithAuth(url, { ...options, method: "DELETE" });
  },
};

export { fetchWithAuth, apiService, APIError, TokenExpiredError };
