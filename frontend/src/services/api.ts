/**
 * PixelOps API Client
 * Centralized fetch wrapper that attaches JWT auth headers and
 * unwraps the standardized { success, data, message } backend envelope.
 */

const BASE_URL = '';

function getToken(): string | null {
  return localStorage.getItem('pixelops_token');
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: authHeaders(),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error ?? json.detail ?? 'Request failed');
  }

  // Unwrap standardized envelope { success, data, message }
  // Backend wraps with success_response, so data holds the real payload
  if (json.success !== undefined) {
    return json.data;
  }
  return json;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export function registerUser(username: string, email: string, password: string) {
  return request<{ access_token: string; user: ApiUser }>('POST', '/auth/register', {
    username,
    email,
    password,
  });
}

export function loginUser(email: string, password: string) {
  return request<{ access_token: string; user: ApiUser }>('POST', '/auth/login', {
    email,
    password,
  });
}

// ─── Games ───────────────────────────────────────────────────────────────────

export function getGames(page = 1, limit = 9, includeInactive = false) {
  return request<ApiGame[]>('GET', `/games/?page=${page}&limit=${limit}&include_inactive=${includeInactive}`);
}

export function getGame(id: string) {
  return request<ApiGame>('GET', `/games/${id}`);
}

export function createGame(title: string, description: string, format: string) {
  return request<ApiGame>('POST', '/games/', { title, description, format });
}

export function deleteGame(id: string) {
  return request<unknown>('DELETE', `/games/${id}`);
}

// ─── Scores ──────────────────────────────────────────────────────────────────

export function submitScore(gameId: string, value: number) {
  return request<ApiScore>('POST', '/scores/', { gameId, value });
}

export function getScores(gameId: string, page = 1, limit = 10) {
  return request<ApiScore[]>('GET', `/scores/${gameId}?page=${page}&limit=${limit}`);
}

// ─── Leaderboard ─────────────────────────────────────────────────────────────

export function getLeaderboard(gameId: string, page = 1, limit = 10) {
  return request<ApiLeaderboardEntry[]>(
    'GET',
    `/leaderboard/${gameId}?page=${page}&limit=${limit}`
  );
}

// ─── Tournaments ─────────────────────────────────────────────────────────────

export function getTournaments(page = 1, limit = 10) {
  return request<ApiTournament[]>('GET', `/tournaments/?page=${page}&limit=${limit}`);
}

export function joinTournament(id: string) {
  return request<unknown>('POST', `/tournaments/${id}/join`);
}

export function getTournamentBracket(id: string) {
  return request<ApiMatch[]>('GET', `/tournaments/${id}/bracket`);
}

// ─── Wallet ──────────────────────────────────────────────────────────────────

export function getWallet() {
  return request<ApiWallet>('GET', '/wallet');
}

export function getTransactions(page = 1, limit = 20) {
  return request<ApiTransaction[]>('GET', `/transactions?page=${page}&limit=${limit}`);
}

// ─── Notifications ───────────────────────────────────────────────────────────

export function getNotifications(page = 1, limit = 20) {
  return request<ApiNotification[]>('GET', `/notifications/?page=${page}&limit=${limit}`);
}

export function markNotificationRead(id: string) {
  return request<ApiNotification>('PATCH', `/notifications/${id}/read`);
}

export function markAllNotificationsRead() {
  return request<{ updated: number }>('PATCH', '/notifications/read-all');
}

// ─── Admin ───────────────────────────────────────────────────────────────────

export function getFraudFlags() {
  return request<ApiFraudFlag[]>('GET', '/admin/fraud-flags');
}

export function resolveFraudFlag(id: string, action: 'CONFIRMED' | 'REJECTED') {
  return request<unknown>('POST', `/admin/fraud-flags/${id}/resolve`, { action });
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ApiUser {
  id: string;
  username: string;
  email: string;
  role: 'PLAYER' | 'ADMIN';
}

export interface ApiGame {
  id: string;
  title: string;
  description: string;
  format: 'HTML5' | 'WEBGL' | 'IFRAME';
  isActive: boolean;
  createdAt: string;
}

export interface ApiScore {
  id: string;
  userId: string;
  gameId: string;
  value: number;
  createdAt: string;
}

export interface ApiLeaderboardEntry {
  rank: number;
  username: string;
  score: number;
}

export interface ApiTournament {
  id: string;
  name: string;
  gameId: string;
  status: 'CREATED' | 'OPEN' | 'ONGOING' | 'COMPLETED' | 'ARCHIVED';
  entryFee: number;
  startDate: string;
  endDate: string;
}

export interface ApiMatch {
  id: string;
  roundNumber: number;
  player1Id: string;
  player2Id: string;
  winnerId: string | null;
}

export interface ApiWallet {
  id: string;
  balance: number;
  createdAt: string;
}

export interface ApiTransaction {
  id: string;
  type: 'CREDIT' | 'DEBIT' | 'REWARD' | 'ENTRY_FEE' | 'REFUND';
  amount: number;
  createdAt: string;
}

export interface ApiNotification {
  id: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface ApiFraudFlag {
  id: string;
  reason: string;
  status: 'PENDING' | 'REVIEWED' | 'CONFIRMED' | 'REJECTED';
  createdAt: string;
  score?: ApiScore;
}
