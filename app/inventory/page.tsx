import { DashboardShell } from "@/components/DashboardShell";
import type { Inventory } from "@/mock/inventory";
import { InventoryTable } from "@/features/inventory/InventoryTable";
import { inventory as mockInventory } from "@/mock/inventory";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://allocation-oms.vercel.app";

async function fetchJson<T>(
  path: string,
  fallback: T[]
): Promise<T[]> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) return fallback;

    return response.json();
  } catch {
    return fallback;
  }
}

export default async function InventoryPage() {
  const inventory = await fetchJson<Inventory>(
    "/api/inventory",
    mockInventory
  );

  return (
    <DashboardShell>
      <main className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Inventory</h1>
        </div>

        <InventoryTable inventory={inventory} />
      </main>
    </DashboardShell>
  );
}
