import { settingService, tripService } from "@workspace/api-client";

export default async function DebugPage() {
  let trips: any[] = [];
  let settings: any[] = [];
  let error = "";

  try {
    const tripsRes = await tripService.getAll({ limit: 20 });
    trips = tripsRes?.data || tripsRes || [];
  } catch (e: any) {
    error += `Trips error: ${e.message}. `;
  }

  try {
    settings = await settingService.getAll();
  } catch (e: any) {
    error += `Settings error: ${e.message}. `;
  }

  // Parse settings
  const getVal = (key: string) => settings.find((s: any) => s.key === key)?.value ?? "";
  const parseIds = (key: string) => {
    try {
      const raw = getVal(key);
      return JSON.parse(raw || "[]")
        .map(Number)
        .filter(Boolean) as number[];
    } catch {
      return [];
    }
  };

  const popTreksIds = parseIds("landing_popular_treks");
  const handpickedIds = parseIds("landing_handpicked_journeys");

  // Filter trips
  const specialities = trips.filter((t: any) => popTreksIds.includes(t.id));
  const packages = trips.filter((t: any) => handpickedIds.includes(t.id));

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">Debug Page</h1>

      {error && <div className="bg-red-100 p-4 mb-4 text-red-700">Error: {error}</div>}

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Raw Data:</h2>
        <p>
          <strong>Total trips fetched:</strong> {trips.length}
        </p>
        <p>
          <strong>Settings count:</strong> {settings.length}
        </p>
        <p>
          <strong>Popular trek IDs from settings:</strong> {JSON.stringify(popTreksIds)}
        </p>
        <p>
          <strong>Handpicked journey IDs from settings:</strong> {JSON.stringify(handpickedIds)}
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Filtered Results:</h2>
        <p>
          <strong>Specialities (matching popular trek IDs):</strong> {specialities.length}
        </p>
        <p>
          <strong>Packages (matching handpicked IDs):</strong> {packages.length}
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">All Trip IDs:</h2>
        <p className="font-mono text-sm">
          {trips.map((t: any) => `${t.id}:${t.title?.substring(0, 20)}`).join(", ")}
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Settings:</h2>
        <pre className="bg-gray-100 p-4 text-sm overflow-auto">
          {JSON.stringify(settings, null, 2)}
        </pre>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Trips Sample:</h2>
        <pre className="bg-gray-100 p-4 text-sm overflow-auto max-h-96">
          {JSON.stringify(trips.slice(0, 2), null, 2)}
        </pre>
      </div>
    </div>
  );
}
