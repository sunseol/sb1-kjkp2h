const getApiUrl = () => {
  if (import.meta.env.PROD) {
    return `https://${import.meta.env.VITE_VERCEL_URL}/api`;
  }
  return `${import.meta.env.VITE_API_URL}/api`;
};

export const API_URL = getApiUrl();
