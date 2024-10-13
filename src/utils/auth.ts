interface User {
  email: string;
  username: string;
  isAdmin?: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

// 로그인 상태를 항상 true로 반환하는 함수
export const isAuthenticated = (): boolean => {
  return true;
};

// 더미 사용자 정보를 반환하는 함수
export const getUser = (): { username: string, email: string } => {
  return { username: 'Guest', email: 'guest@example.com' };
};

// 나머지 함수들은 주석 처리
/*
export const authenticate = async (username: string, password: string): Promise<User | null> => {
  try {
    const response = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error('Authentication failed');
    }

    const data = await response.json();
    if (data.success) {
      return { username, email: data.email, isAdmin: data.isAdmin };
    }
    return null;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
};

export const login = (user: User): void => {
  localStorage.setItem('isAuthenticated', 'true');
  localStorage.setItem('username', user.username);
  localStorage.setItem('email', user.email);
  if (user.isAdmin !== undefined) {
    localStorage.setItem('isAdmin', user.isAdmin.toString());
  }
};

export const logout = (): void => {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('username');
  localStorage.removeItem('email');
  localStorage.removeItem('isAdmin');
};

export const signup = async (username: string, email: string, password: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${API_URL}/api/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    const text = await response.text();
    console.log('Raw response:', text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (error) {
      console.error('Failed to parse response:', error);
      return { success: false, message: 'Invalid server response' };
    }

    if (!response.ok) {
      throw new Error(data.message || 'Signup failed');
    }

    return { success: true, message: data.message };
  } catch (error) {
    console.error('Signup error:', error);
    return { success: false, message: error instanceof Error ? error.message : 'An error occurred during signup' };
  }
};
*/
