import { getUserPlan } from "@/lib/billing";
export const maxDuration = 120;

export async function GET() {
  try {
    return Response.json(await getUserPlan(), { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return Response.json({ plan: "free", subscription: null, error: "Unable to verify billing. Please retry." }, { status: 503 });
  }
}
