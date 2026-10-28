import Link from "next/link";

function safeDecode(value: string | undefined): string | null {
  if (!value) return null;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export default async function SmsCampaignSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; name?: string; rows?: string }>;
}) {
  const { id, name, rows } = await searchParams;
  const campaignName = safeDecode(name);

  return (
    <div className="ledger-paper min-h-screen">
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <span className="stamp mx-auto inline-block rounded px-4 py-1.5 font-mono text-sm font-extrabold uppercase tracking-[0.2em] text-teal-600">
          ✓ Queued
        </span>
        <h1 className="mt-6 font-sans text-3xl font-extrabold text-ink-900">
          Campaign {id ? `#${id}` : ""} is sending
        </h1>
        <p className="mt-3 text-[15px] text-ink-700">
          {campaignName ? <strong>{campaignName}</strong> : "Your campaign"} left the ledger and
          entered BullMQ — AkashSMS fires at 50 SMS/sec
          {rows ? ` · sample previewed ${rows} rows` : ""}.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/sms-campaign"
            className="rounded-lg bg-ink-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink-950"
          >
            New campaign
          </Link>
          <Link
            href="/"
            className="rounded-lg border border-paper-300 bg-paper-50 px-5 py-2.5 text-sm font-semibold text-ink-900 hover:border-teal-600"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
