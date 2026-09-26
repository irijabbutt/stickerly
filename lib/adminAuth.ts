export interface AdminCredentials {
  email: string;
  password: string;
}

/**
 * Real server-checked login: posts to /api/admin/login, which verifies against
 * the ADMIN_EMAIL / ADMIN_PASSWORD environment variables and, on success, sets
 * a signed httpOnly session cookie. No credentials are ever shipped to the
 * browser (unlike the previous hardcoded client-side check).
 */
export async function login(credentials: AdminCredentials): Promise<{ ok: boolean; error?: string }> {
  try {
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      return { ok: false, error: data.error || 'Invalid email or password' };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: 'Network error, please try again' };
  }
}

export async function logout(): Promise<void> {
  await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' }).catch(() => {});
}

export async function isAdminSession(): Promise<boolean> {
  try {
    const response = await fetch('/api/admin/session', { credentials: 'include', cache: 'no-store' });
    if (!response.ok) return false;
    const data = await response.json();
    return Boolean(data.authenticated);
  } catch {
    return false;
  }
}
