import { inventory } from "@/mock/inventory";

export async function GET() {
  return Response.json(inventory);
}