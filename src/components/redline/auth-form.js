"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { GithubLogo, GoogleLogo } from "./brand";

const authErrors = {
  INVALID_EMAIL_OR_PASSWORD: "The email or password is incorrect. Please try again.",
  USER_ALREADY_EXISTS: "An account with this email already exists. Sign in instead.",
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "An account with this email already exists. Sign in instead.",
  PASSWORD_TOO_SHORT: "Choose a password with at least 8 characters.",
  PASSWORD_TOO_LONG: "Your password must be 128 characters or fewer.",
  EMAIL_NOT_VERIFIED: "Please verify your email before signing in.",
  TOO_MANY_REQUESTS: "Too many attempts. Please wait a moment and try again.",
};

function PasswordField({ name, label, signup, disabled, hint }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="credential-field">
      <label htmlFor={name}>{label}</label>
      <div className="password-input">
        <input id={name} name={name} type={visible ? "text" : "password"}
          autoComplete={signup ? "new-password" : "current-password"}
          placeholder={signup ? "At least 8 characters" : "Enter your password"}
          minLength={signup ? 8 : undefined} maxLength={128}
          aria-describedby={hint ? `${name}-hint` : undefined} disabled={disabled} required />
        <button className="password-visibility icon-button" type="button"
          aria-label={`${visible ? "Hide" : "Show"} ${label.toLowerCase()}`}
          aria-pressed={visible} disabled={disabled} onClick={() => setVisible(!visible)}>
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {hint && <small id={`${name}-hint`}>{hint}</small>}
    </div>
  );
}

export default function AuthForm({ mode = "login" }) {
  const signup = mode === "signup";
  const router = useRouter();
  const [pending, setPending] = useState(null);
  const [error, setError] = useState("");
  const requestInFlight = useRef(false);
  const errorRef = useRef(null);
  const busy = pending !== null;

  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("error")) {
      setError("Social sign-in wasn’t completed. Please try again.");
    }
  }, []);
  useEffect(() => { if (error) errorRef.current?.focus(); }, [error]);

  function resetPending() {
    requestInFlight.current = false;
    setPending(null);
  }

  async function submitCredentials(event) {
    event.preventDefault();
    if (requestInFlight.current) return;
    setError("");
    const form = event.currentTarget;
    const values = new FormData(form);
    const name = String(values.get("name") || "").trim();
    const email = String(values.get("email") || "").trim();
    const password = String(values.get("password") || "");
    if (signup && !name) { setError("Please enter your name."); return; }
    if (signup && password !== values.get("confirmPassword")) {
      setError("The passwords don’t match. Please enter them again."); return;
    }
    requestInFlight.current = true;
    setPending("credentials");
    try {
      const result = signup
        ? await authClient.signUp.email({ name, email, password, callbackURL: "/dashboard" })
        : await authClient.signIn.email({ email, password, rememberMe: values.get("rememberMe") === "on", callbackURL: "/dashboard" });
      if (result.error) {
        setError(authErrors[result.error.code] || result.error.message || "Unable to sign in. Please try again.");
        resetPending(); return;
      }
      // Better Auth sets the session cookie; never store passwords or tokens locally.
      form.reset();
      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("Couldn’t connect. Check your connection and try again.");
      resetPending();
    }
  }

  async function socialSignIn(provider) {
    if (requestInFlight.current) return;
    requestInFlight.current = true;
    setPending(provider);
    setError("");
    try {
      const result = await authClient.signIn.social({ provider, callbackURL: "/dashboard", errorCallbackURL: signup ? "/signup?error=oauth" : "/login?error=oauth" });
      if (result.error) { setError(result.error.message || "Unable to connect to your provider."); resetPending(); }
      // Keep controls disabled while the browser redirects to the provider.
    } catch {
      setError("Couldn’t connect to your provider. Please try again.");
      resetPending();
    }
  }

  return (
    <div className="auth-methods">
      <nav className="auth-mode-switch" aria-label="Account access">
        <Link href="/login" aria-current={!signup ? "page" : undefined}>Sign in</Link>
        <Link href="/signup" aria-current={signup ? "page" : undefined}>Create account</Link>
      </nav>
      <form className="credentials-form" onSubmit={submitCredentials} aria-busy={pending === "credentials"}>
        {signup && <div className="credential-field">
          <label htmlFor="name">Full name</label>
          <input id="name" name="name" type="text" autoComplete="name" placeholder="Your name" maxLength={100} disabled={busy} required />
        </div>}
        <div className="credential-field">
          <label htmlFor="email">Email address</label>
          <input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" maxLength={254} disabled={busy} required />
        </div>
        <PasswordField name="password" label="Password" signup={signup} disabled={busy} hint={signup ? "Use 8–128 characters. Keep this password unique." : undefined} />
        {signup && <PasswordField name="confirmPassword" label="Confirm password" signup disabled={busy} />}
        {!signup && <label className="remember-session"><input type="checkbox" name="rememberMe" defaultChecked disabled={busy} /><span>Keep me signed in</span></label>}
        {error && <div className="auth-error" ref={errorRef} tabIndex={-1} role="alert">{error}</div>}
        <button className="credentials-submit" type="submit" disabled={busy}>
          {pending === "credentials" && <LoaderCircle size={17} className="spin" />}
          <span>{pending === "credentials" ? (signup ? "Creating your account…" : "Signing you in…") : (signup ? "Create account" : "Sign in to Redline")}</span>
          {pending !== "credentials" && <ArrowRight size={17} />}
        </button>
      </form>
      <div className="login-divider"><span />OR CONTINUE WITH<span /></div>
      <div className="oauth-buttons">
        <button type="button" className="oauth-button google-button" disabled={busy} onClick={() => socialSignIn("google")}>
          {pending === "google" ? <LoaderCircle className="spin" /> : <GoogleLogo />}
          <span>{pending === "google" ? "Connecting to Google…" : "Continue with Google"}</span><ArrowRight size={18} />
        </button>
        <button type="button" className="oauth-button github-button" disabled={busy} onClick={() => socialSignIn("github")}>
          {pending === "github" ? <LoaderCircle className="spin" /> : <GithubLogo />}
          <span>{pending === "github" ? "Connecting to GitHub…" : "Continue with GitHub"}</span><ArrowRight size={18} />
        </button>
      </div>
      <p className="auth-account-link">{signup ? "Already have an account? " : "New to Redline? "}<Link href={signup ? "/login" : "/signup"}>{signup ? "Sign in" : "Create an account"}</Link></p>
    </div>
  );
}
