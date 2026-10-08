// ponytail: localStorage ledger — the backend has no list endpoints, so the
// device keeps the template library, launch history, and studio drafts.
// Drop this the day GET /api/sms/templates + /campaigns exist.

export interface StoredTemplate {
  id: number | string;
  name: string;
  content: string;
  isApproved: boolean;
  layaScore: number | null;
  sample?: boolean;
  at: number;
}

export interface HistoryEntry {
  id: number;
  name: string;
  at: number;
}

const TPL_KEY = "saptasms_templates";
const HIST_KEY = "saptasms_history";
const DRAFT_KEY = "saptasms_draft";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode — session-only */
  }
}

const STARTERS: StoredTemplate[] = [
  {
    id: "starter-overdue",
    name: "Overdue payment notice",
    content:
      "Dear {name}, your payment of Rs. {amount} was due on {due_date}. Pay via eSewa to avoid penalty.",
    isApproved: true,
    layaScore: 0.1,
    sample: true,
    at: 0,
  },
  {
    id: "starter-reminder",
    name: "Gentle due-date reminder",
    content:
      "Namaste {name}, reminder: Rs. {amount} is due {due_date}. Visit your branch or pay online. Dhanyabad!",
    isApproved: false,
    layaScore: null,
    sample: true,
    at: 0,
  },
];

export const store = {
  templates(): StoredTemplate[] {
    const mine = read<StoredTemplate[]>(TPL_KEY, []);
    return [...mine, ...STARTERS];
  },
  upsertTemplate(t: StoredTemplate) {
    const mine = read<StoredTemplate[]>(TPL_KEY, []).filter((x) => x.id !== t.id);
    write(TPL_KEY, [{ ...t, sample: false }, ...mine].slice(0, 100));
  },
  history(): HistoryEntry[] {
    return read<HistoryEntry[]>(HIST_KEY, []).sort((a, b) => b.at - a.at);
  },
  pushHistory(e: HistoryEntry) {
    write(HIST_KEY, [e, ...read<HistoryEntry[]>(HIST_KEY, [])].slice(0, 100));
  },
  saveDraft(d: { name: string; content: string }) {
    write(DRAFT_KEY, d);
  },
  takeDraft(): { name: string; content: string } | null {
    const d = read<{ name: string; content: string } | null>(DRAFT_KEY, null);
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* ignore */
    }
    return d;
  },
};
