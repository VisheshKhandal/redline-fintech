import { SITE_URL, SITE_DESCRIPTION } from "@/lib/seo";
import Link from "next/link";
import { ArrowUpRight, LockKeyhole, Orbit, ShieldCheck, Zap } from "lucide-react";
import { Brand } from "./brand";
import AuthForm from "./auth-form";

export default function AuthPage({ mode = "login" }) {
  const signup = mode === "signup";
  return <main className="redline login-shell">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "SoftwareApplication", name: "Redline", url: `${SITE_URL}/login`, description: SITE_DESCRIPTION, applicationCategory: "FinanceApplication", operatingSystem: "Web" }).replace(/</g, "\u003c") }} />
    <section className="login-story" aria-label="Redline market intelligence">
      <Brand />
      <div className="story-copy enter"><span className="eyebrow"><span className="status-dot" /> A NEW PERSPECTIVE ON THE MARKETS</span>
        <h1>See the signal.<br /><span>Own the moment.</span></h1>
        <p>A sharper lens on every move. Your markets,<br className="desktop-break" /> your portfolio, your next possibility.</p>
      </div>
      <div className="orbital-scene" aria-hidden="true">
        <div className="orbital-grid" /><div className="orbit-ring ring-one" /><div className="orbit-ring ring-two" /><div className="orbit-ring ring-three" />
        <div className="core-sphere"><div className="sphere-grid" /><svg viewBox="0 0 160 160"><path d="m35 109 27-58h27l-27 58H35Zm44 0 27-58h19l-27 58H79Z" fill="currentColor" /></svg></div>
        <div className="orbit-dot dot-one" /><div className="orbit-dot dot-two" /><div className="orbit-dot dot-three" />
        <div className="floating-quote quote-one"><span className="quote-icon">N</span><div><b>NVDA</b><small>NVIDIA Corporation</small></div><div><b>$142.87</b><small className="positive">↗ 2.84%</small></div></div>
        <div className="floating-quote quote-two"><span className="tiny-label">PORTFOLIO PERFORMANCE</span><strong>+18.62% <ArrowUpRight size={18} /></strong><svg viewBox="0 0 180 42"><path d="M0 38 12 30 24 34 35 24 46 28 58 18 71 22 83 9 95 16 108 14 120 20 134 6 146 10 158 3 170 7 180 0" fill="none" stroke="#ed3c51" strokeWidth="2" /></svg><small>Illustrative demo performance</small></div>
        <span className="orbit-caption">A WORLD OF OPPORTUNITY. IN YOUR ORBIT.</span>
      </div>
      <div className="story-bottom"><span><Zap size={14} /> Clarity is your edge.</span><span>EST. 2026 <span className="red-text">↗</span></span></div>
    </section>
    <section className="login-panel">
      <div className="login-top"><span>YOUR NEXT MOVE STARTS HERE</span><span className="small-pill"><span className="status-dot" /> MARKET INTELLIGENCE</span></div>
      <div className="login-form enter">
        <div className="login-emblem"><Orbit size={26} /></div><span className="eyebrow red-text">WELCOME TO REDLINE</span>
        <h2>{signup ? "Make your next move." : "Your edge starts here."}</h2><p>{signup ? "Create your account. Bring the bigger picture closer." : "Sign in to bring your market into focus."}</p>
        <AuthForm key={mode} mode={mode} />
        <div className="login-divider"><span />OR EXPLORE FIRST<span /></div>
        <Link className="demo-link" href="/dashboard">Explore the demo terminal <ArrowUpRight size={16} /></Link>
        <p className="login-note">A little curiosity goes a long way.<br />Explore with sample data, no account needed.</p>
        <div className="login-assurance"><ShieldCheck size={16} /><span>Secure sign-in. Your account stays in your control.</span></div>
      </div>
      <footer className="login-footer"><span>© 2026 Redline</span><span><LockKeyhole size={12} /> Built for your peace of mind</span></footer>
    </section>
  </main>;
}
