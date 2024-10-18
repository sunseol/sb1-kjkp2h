export const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://sb1-kjkp2h-git-v11-sunseols-projects.vercel.app'
  : 'http://localhost:3001';

export const fetchProjects = async (userId: string) => {
  const response = await fetch(`${API_URL}/api/projects?userId=${userId}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// 다른 API 호출 함수들...

