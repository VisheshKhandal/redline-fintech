import { requirePro } from "@/lib/billing";
import { riskMetrics } from "@/lib/premium-data";
export const maxDuration = 120;

export async function GET() {
  try {
    await requirePro();
    return Response.json({ demoData: true, risk: riskMetrics,
      report: `Redline Pro portfolio report (Demo Data)\nVolatility: ${riskMetrics.volatilityAnnualized}\nSharpe ratio: ${riskMetrics.sharpeRatio}\nMaximum drawdown: ${riskMetrics.maxDrawdown}\n`,
    }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    const status = error.status || 503;
    return Response.json({ error: status === 503 ? "Unable to verify subscription" : error.message }, { status });
  }
}
