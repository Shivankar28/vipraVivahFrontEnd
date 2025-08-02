import { jwtDecode } from 'jwt-decode';

export function getPlanFromToken(token) {
  try {
    const decoded = jwtDecode(token);
    return decoded.plan || 'free';
  } catch {
    return 'free';
  }
} 