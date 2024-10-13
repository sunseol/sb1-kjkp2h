interface User {
  email: string;
  username: string;
  isAdmin?: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

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

export const isAuthenticated = (): boolean => {
  return localStorage.getItem('isAuthenticated') === 'true';
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
    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();
    console.log('Signup response:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Signup failed');
    }

    return { success: true, message: data.message };
  } catch (error) {
    console.error('Signup error:', error);
    return { success: false, message: error instanceof Error ? error.message : 'An error occurred during signup' };
  }
};
