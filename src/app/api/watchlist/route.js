import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getUserPlan } from "@/lib/billing";
import { stocks, PLANS } from "@/lib/market-data";
export const maxDuration = 120;

export async function GET(request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: "Sign in required" }, { status: 401 });
  const user = await db.user.findUnique({ where: { id: session.user.id }, select: { watchlistSymbols: true } });
  return Response.json({ symbols: user.watchlistSymbols }, { headers: { "Cache-Control": "private, no-store" } });
}

export async function PUT(request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) return Response.json({ error: "Invalid origin" }, { status: 403 });
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) return Response.json({ error: "Sign in required" }, { status: 401 });
    const { symbols } = await request.json();
    if (!Array.isArray(symbols) || symbols.length > 1000 || symbols.some((s) => !stocks.some((stock) => stock.symbol === s)) || new Set(symbols).size !== symbols.length) {
      return Response.json({ error: "Invalid watchlist" }, { status: 400 });
    }
    const { plan } = await getUserPlan();
    if (plan !== "pro" && symbols.length > PLANS.FREE.watchlistLimit) {
      const current = await db.user.findUnique({ where: { id: session.user.id }, select: { watchlistSymbols: true } });
      const onlyRemoving = symbols.length < current.watchlistSymbols.length && symbols.every((s) => current.watchlistSymbols.includes(s));
      if (!onlyRemoving) return Response.json({ error: "Pro required for more than five assets" }, { status: 403 });
    }
    await db.user.update({ where: { id: session.user.id }, data: { watchlistSymbols: symbols } });
    return Response.json({ symbols });
  } catch {
    return Response.json({ error: "Unable to save watchlist" }, { status: 503 });
  }
}
