import type { Order } from "@/mock/orders";
import type { Customer } from "@/mock/customer";
import type { Inventory } from "@/mock/inventory";
import { DashboardShell } from "@/components/DashboardShell";
import { orders as mockOrders } from "@/mock/orders";
import { customers as mockCustomers } from "@/mock/customer";
import { inventory as mockInventory } from "@/mock/inventory";
import { OrdersTable } from "@/features/dashboard/OrdersTable";

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

export default async function DashboardPage() {
  const [orders, customers, inventory] = await Promise.all([
    fetchJson<Order>("/api/orders", mockOrders),
    fetchJson<Customer>("/api/customer", mockCustomers),
    fetchJson<Inventory>("/api/inventory", mockInventory),
  ]);

  return (
    <DashboardShell>
      <main className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            Allocation Dashboard
          </h1>
        </div>

        <OrdersTable
          initialOrders={orders}
          initialCustomers={customers}
          initialInventory={inventory}
        />
      </main>
    </DashboardShell>
  );
}
