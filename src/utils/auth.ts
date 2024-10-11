interface User {
  email: string;
  password: string;
  isAdmin: boolean;
}

const users: User[] = [
  {
    email: 'admin@x.xom',
    password: 'admin', // 실제 환경에서는 절대 평문으로 저장하지 마세요!
    isAdmin: true
  }
];

export const authenticate = (email: string, password: string): User | null => {
  const user = users.find(u => u.email === email && u.password === password);
  return user || null;
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

export const login = (user: User): void => {
  localStorage.setItem('isAuthenticated', 'true');
  localStorage.setItem('userEmail', user.email);
  localStorage.setItem('isAdmin', user.isAdmin.toString());
};

export const logout = (): void => {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('isAdmin');
};