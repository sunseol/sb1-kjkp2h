const getApiUrl = () => {
  if (import.meta.env.PROD) {
    // Vercel 환경에서는 현재 호스트를 사용
    return `https://${window.location.hostname}/api`;
  }
  // 개발 환경
  return `${import.meta.env.VITE_API_URL}/api`;
};

export const API_URL = getApiUrl();

export const fetchProjects = async (userId: string) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/projects`);
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

// 다른 API 호출 함수들...
