const getApiUrl = () => {
  if (import.meta.env.PROD) {
    // Vercel 환경에서는 현재 호스트를 사용
    return `https://${window.location.hostname}/api`;
  }
  // 개발 환경
  return `${import.meta.env.VITE_API_URL}/api`;
};

export const API_URL = getApiUrl();
