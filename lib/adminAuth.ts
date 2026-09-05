const ADMIN_EMAIL = 'admin@stickerly.com';
const ADMIN_PASSWORD = 'admin@stickerly';
const SESSION_KEY = 'stickerly-admin-session';

export interface AdminCredentials {
  email: string;
  password: string;
}

export function login(credentials: AdminCredentials): boolean {
  if (credentials.email === ADMIN_EMAIL && credentials.password === ADMIN_PASSWORD) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(SESSION_KEY, 'true');
    }
    return true;
  }
  return false;
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY);
  }
}

export function isAdminSession(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(SESSION_KEY) === 'true';
}
