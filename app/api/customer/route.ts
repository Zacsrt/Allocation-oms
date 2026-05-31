import { customers } from "@/mock/customer";

export async function GET() {
  return Response.json(customers);
}
