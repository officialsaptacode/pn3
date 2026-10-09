export interface SmsTemplate {
  id: number;
  name: string;
  content: string;
  isApproved: boolean;
  layaScore?: number | null;
  userId?: number;
}

export interface EvaluateResult {
  id: number;
  layaScore: number;
  isApproved: boolean;
}

export interface PresignedUrl {
  url: string;
  key: string;
  fullUrl: string;
}

export interface Campaign {
  id: number;
  name: string;
  status: string;
  templateId: number;
  userId?: number;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:5000";

// Session rides on httpOnly cookies (accessToken + refreshToken) set by the
// API on signin — nothing secret ever touches JS or localStorage.
const JSON_HEADERS: HeadersInit = { "Content-Type": "application/json" };

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export interface SessionUser {
  id: number;
  email: string;
  role: string;
}

export const authApi = {
  signin(userName: string, password: string) {
    return fetch(`${API_BASE}/api/auth/signin`, {
      method: "POST",
      credentials: "include",
      headers: JSON_HEADERS,
      body: JSON.stringify({ userName, password }),
    }).then(handle<{ role: string; message: string }>);
  },
  profile() {
    return fetch(`${API_BASE}/api/users/profile`, { credentials: "include" }).then(
      handle<SessionUser>,
    );
  },
  signout() {
    return fetch(`${API_BASE}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    }).then(handle<unknown>);
  },
};

export const smsApi = {
  createTemplate(name: string, content: string) {
    return fetch(`${API_BASE}/api/sms/templates`, {
      method: "POST",
      credentials: "include",
      headers: JSON_HEADERS,
      body: JSON.stringify({ name, content }),
    }).then(handle<SmsTemplate>);
  },

  evaluateTemplate(id: number) {
    return fetch(`${API_BASE}/api/sms/templates/${id}/evaluate`, {
      method: "POST",
      credentials: "include",
    }).then(handle<EvaluateResult & Partial<SmsTemplate>>);
  },

  presignedUrl(filename: string, contentType: string) {
    return fetch(`${API_BASE}/api/sms/presigned-url`, {
      method: "POST",
      credentials: "include",
      headers: JSON_HEADERS,
      body: JSON.stringify({ filename, contentType }),
    }).then(handle<PresignedUrl>);
  },

  uploadToS3(url: string, file: File) {
    return fetch(url, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type || "text/csv" },
    }).then((res) => {
      if (!res.ok) throw new Error(`S3 upload failed (${res.status})`);
    });
  },

  createCampaign(name: string, templateId: number, csvUrl: string) {
    return fetch(`${API_BASE}/api/sms/campaigns`, {
      method: "POST",
      credentials: "include",
      headers: JSON_HEADERS,
      body: JSON.stringify({ name, templateId, csvUrl }),
    }).then(handle<Campaign>);
  },
};

/** Extract {variables} from template content. */
export function extractVariables(content: string): string[] {
  const found = new Set<string>();
  for (const m of content.matchAll(/\{(\w+)\}/g)) if (m[1]) found.add(m[1]);
  return [...found];
}

/** GSM-7 single SMS = 160 chars, multipart segments = 153. */
export function smsSegments(content: string): { chars: number; segments: number } {
  const chars = content.length;
  return { chars, segments: chars <= 160 ? 1 : Math.ceil(chars / 153) };
}

// ponytail: naive CSV split (no quoted-newline support). Upgrade to a real
// parser only when managers paste multiline quoted fields and it breaks.
export interface ParsedCsv {
  headers: string[];
  rows: Record<string, string>[];
}

export function parseCsvPreview(text: string, maxRows = 5): ParsedCsv {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return { headers: [], rows: [] };
  const first = lines[0];
  if (!first) return { headers: [], rows: [] };
  const split = (line: string) => line.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
  const headers = split(first);
  const rows = lines.slice(1, 1 + maxRows).map((line) => {
    const cells = split(line);
    return Object.fromEntries(headers.map((h, i) => [h, cells[i] ?? ""]));
  });
  return { headers, rows };
}

export function findPhoneColumn(headers: string[]): string | null {
  const norm = (h: string) => h.toLowerCase().replace(/[\s_-]/g, "");
  const keys = ["phone", "phonenumber", "mobile", "mobilenumber", "contact"];
  for (const h of headers) if (keys.includes(norm(h))) return h;
  return null;
}

/** Fill {vars} with a sample row for live preview. */
export function previewMessage(template: string, row?: Record<string, string>): string {
  if (!row) return template;
  return template.replace(/\{(\w+)\}/g, (_, k) => row[k] ?? `{${k}}`);
}
