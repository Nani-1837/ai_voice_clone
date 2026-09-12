/**
 * Dubzeek AI Client-Side API Helper with Auto-Refresh & Security Interceptors
 */

const getApiBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
};

export async function authenticatedFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const apiBaseUrl = getApiBaseUrl();
  const url = endpoint.startsWith("http") ? endpoint : `${apiBaseUrl}${endpoint}`;
  
  const token = typeof window !== "undefined" ? localStorage.getItem("dubzeek_access_token") : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Include credentials so HttpOnly refresh cookies are sent automatically
  const fetchOptions: RequestInit = {
    ...options,
    headers,
    credentials: "include",
  };

  let response = await fetch(url, fetchOptions);

  // If 401 Unauthorized (Access Token Expired), attempt silent refresh
  if (response.status === 401 && typeof window !== "undefined") {
    console.log("[AUTH INTERCEPTOR] Access token expired. Attempting silent refresh...");
    
    try {
      const refreshResponse = await fetch(`${apiBaseUrl}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        localStorage.setItem("dubzeek_access_token", refreshData.access_token);

        // Retry original request with new token
        headers["Authorization"] = `Bearer ${refreshData.access_token}`;
        response = await fetch(url, {
          ...options,
          headers,
          credentials: "include",
        });
      } else {
        // Refresh token invalid or revoked -> Logout user
        console.warn("[AUTH INTERCEPTOR] Refresh token expired or revoked. Logging out.");
        logoutUser();
      }
    } catch (err) {
      console.error("[AUTH INTERCEPTOR] Error refreshing token:", err);
      logoutUser();
    }
  }

  return response;
}

export async function logoutUser() {
  const apiBaseUrl = getApiBaseUrl();
  try {
    const token = localStorage.getItem("dubzeek_access_token");
    await fetch(`${apiBaseUrl}/api/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
    });
  } catch (err) {
    console.error("Logout request error:", err);
  } finally {
    localStorage.removeItem("dubzeek_access_token");
    localStorage.removeItem("dubzeek_user");
    if (typeof window !== "undefined") {
      window.location.href = "/auth/login";
    }
  }
}
