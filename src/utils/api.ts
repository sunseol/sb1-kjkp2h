export const API_URL = process.env.VERCEL_URL 
? `https://sb1-kjkp2h-git-v11-sunseols-projects.vercel.app`
: 'http://localhost:3000/api';

export const fetchProjects = async (userId: string) => {
  const response = await fetch(`${API_URL}/projects?userId=${userId}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const login = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Login error response:', errorText);
    throw new Error(errorText || '로그인에 실패했습니다.');
  }
  return response.json();
};

export const fetchAIAdvice = async (projectData: any) => {
  try {
    const response = await fetch(`${API_URL}/ai-advice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI 조언 응답:', data);
    return data;
  } catch (error) {
    console.error('AI 조언 요청 중 오류 발생:', error);
    throw error;
  }
};

// 다른 API 호출 함수들...
