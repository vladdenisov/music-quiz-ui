const devBackendUrl = "http://localhost:3001";

export const env = {
  apiUrl: import.meta.env.VITE_API_URL || devBackendUrl,
  socketUrl: import.meta.env.VITE_SOCKET_URL || (import.meta.env.DEV ? devBackendUrl : undefined)
};
