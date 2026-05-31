import { orders } from "@/mock/orders";

export async function GET() {
  return Response.json(orders);
}
