import { DashboardShell } from "@/components/DashboardShell";
import type { Customer } from "@/mock/customer";
import { CustomersTable } from "@/features/customers/CustomersTable";
import { customers as mockCustomers } from "@/mock/customer";

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

export default async function CustomerListPage() {
  const customers = await fetchJson<Customer>(
    "/api/customer",
    mockCustomers
  );

  return (
    <DashboardShell>
      <main className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Customer List</h1>
        </div>

        <CustomersTable customers={customers} />
      </main>
    </DashboardShell>
  );
}
