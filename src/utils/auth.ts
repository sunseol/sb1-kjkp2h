import { GetServerSidePropsContext } from 'next'; // GetServerSidePropsContext 임포트 추가
import { getSession } from 'next-auth/react'; // 이 줄을 추가합니다.

interface User {
  email: string;
  username: string;
  isAdmin?: boolean;
  id: string;
}

const getApiUrl = () => {
  if (import.meta.env.PROD) {
    // Vercel 환경에서는 현재 호스트를 사용
    return `https://${window.location.hostname}/api`;
  }
  // 개발 환경
  return `${import.meta.env.VITE_API_URL}/api`;
};

export const API_URL = getApiUrl();

export const isAuthenticated = (): boolean => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

export const getUser = (): { id: string, username: string, email: string } | null => {
  const id = localStorage.getItem('userId');
  const username = localStorage.getItem('username');
  const email = localStorage.getItem('email');
  return id && username && email ? { id, username, email } : null;
};

export const authenticate = async (email: string, password: string): Promise<User | null> => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log('Server response:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Authentication failed');
    }

    if (data.success && data.id) {
      return { id: data.id, email, username: data.username };
    }
    return null;
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
};

export const login = (user: User): void => {
  localStorage.setItem('isAuthenticated', 'true');
  localStorage.setItem('userId', user.id);
  localStorage.setItem('username', user.username);
  localStorage.setItem('email', user.email);
  if (user.isAdmin !== undefined) {
    localStorage.setItem('isAdmin', user.isAdmin.toString());
  }
};

export const logout = (): void => {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
  localStorage.removeItem('email');
  localStorage.removeItem('isAdmin');
};

export const signup = async (username: string, email: string, password: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Signup failed');
    }

    return { success: true, message: data.message };
  } catch (error) {
    console.error('Signup error:', error);
    return { success: false, message: error instanceof Error ? error.message : 'An error occurred during signup' };
  }
};
