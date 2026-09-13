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

/**
 * Resumable Chunked Video Upload Helper (Up to 3 GB)
 */
export async function uploadVideoResumable(
  file: File,
  sourceLang: string = "English",
  targetLang: string = "Telugu",
  projectId: string = "dub-default",
  onProgress?: (progress: number) => void
): Promise<any> {
  const apiBaseUrl = getApiBaseUrl();

  // 1. Initialize upload session
  const initRes = await fetch(`${apiBaseUrl}/api/video/upload-init`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filename: file.name,
      file_size: file.size,
      project_id: projectId,
      source_language: sourceLang,
      target_language: targetLang,
    }),
  });

  if (!initRes.ok) {
    const errData = await initRes.json();
    throw new Error(errData.detail || "Failed to initialize upload session");
  }

  const { upload_id, chunk_size, total_chunks } = await initRes.json();

  // 2. Upload chunks in sequence
  for (let i = 0; i < total_chunks; i++) {
    const start = i * chunk_size;
    const end = Math.min(file.size, start + chunk_size);
    const chunkBlob = file.slice(start, end);

    const formData = new FormData();
    formData.append("upload_id", upload_id);
    formData.append("chunk_index", i.toString());
    formData.append("chunk_file", chunkBlob, file.name);

    const chunkRes = await fetch(`${apiBaseUrl}/api/video/upload-chunk`, {
      method: "POST",
      body: formData,
    });

    if (!chunkRes.ok) {
      throw new Error(`Chunk ${i + 1}/${total_chunks} upload failed`);
    }

    if (onProgress) {
      onProgress(Math.round(((i + 1) / total_chunks) * 100));
    }
  }

  // 3. Finalize upload and save metadata to Neon DB
  const completeRes = await fetch(`${apiBaseUrl}/api/video/upload-complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      upload_id,
      filename: file.name,
      project_id: projectId,
      source_language: sourceLang,
      target_language: targetLang,
    }),
  });

  if (!completeRes.ok) {
    const completeErr = await completeRes.json();
    throw new Error(completeErr.detail || "Failed to finalize video assembly and save DB record");
  }

  return await completeRes.json();
}
