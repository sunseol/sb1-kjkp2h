import { API_URL } from './api';

interface User {
  email: string;
  username: string;
  isAdmin?: boolean;
  id: string;
}

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
    const url = `${API_URL}/api/login`;
    console.log('Authenticating at:', url);
    console.log('Request body:', JSON.stringify({ email, password }));
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', JSON.stringify(Object.fromEntries(response.headers)));

    const text = await response.text();
    console.log('Response text:', text);

    if (!response.ok) {
      throw new Error(`Authentication failed: ${response.status} ${text}`);
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (error) {
      console.error('Failed to parse response as JSON:', error);
      throw new Error('Invalid response format');
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
    const response = await fetch(`${API_URL}/api/register`, {
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
