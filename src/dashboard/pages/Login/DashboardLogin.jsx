import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authClient } from "../../../lib/auth-client";
import "./DashboardLogin.css";

export default function DashboardLogin() {
  const navigate = useNavigate();
  const { data: session, isPending } = authClient.useSession();
  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    if (submitting) return false;
    if (!email.trim() || !password.trim()) return false;
    if (mode === "signup" && !name.trim()) return false;
    return true;
  }, [email, password, name, mode, submitting]);

  if (isPending) {
    return (
      <div className="zb-dashLogin">
        <div className="zb-dashLogin__card">Loading…</div>
      </div>
    );
  }

  if (session) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);
    try {
      const { error } =
        mode === "signup"
          ? await authClient.signUp.email({
              name: name.trim(),
              email: email.trim(),
              password,
              callbackURL: "/dashboard",
            })
          : await authClient.signIn.email({
              email: email.trim(),
              password,
              callbackURL: "/dashboard",
            });
      if (error) {
        setErrorMsg(error.message || (mode === "signup" ? "Sign up failed" : "Sign in failed"));
        return;
      }
      navigate("/dashboard", { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="zb-dashLogin">
      <form className="zb-dashLogin__card" onSubmit={onSubmit}>
        <div className="zb-dashLogin__header">
          <div className="zb-dashLogin__tabs" role="tablist" aria-label="Dashboard authentication">
            <button
              type="button"
              role="tab"
              aria-selected={mode === "signin"}
              className={`zb-dashLogin__tab${mode === "signin" ? " zb-dashLogin__tab--active" : ""}`}
              onClick={() => {
                setMode("signin");
                setErrorMsg("");
              }}
            >
              Sign in
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "signup"}
              className={`zb-dashLogin__tab${mode === "signup" ? " zb-dashLogin__tab--active" : ""}`}
              onClick={() => {
                setMode("signup");
                setErrorMsg("");
              }}
            >
              Sign up
            </button>
          </div>

          <p className="zb-dashLogin__title">
            {mode === "signup" ? "Create dashboard account" : "Dashboard sign in"}
          </p>
          <p className="zb-dashLogin__sub">Ziva by Ekay</p>
        </div>

        {mode === "signup" ? (
          <label className="zb-dashLogin__field">
            <span>Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              autoComplete="name"
              required
            />
          </label>
        ) : null}

        <label className="zb-dashLogin__field">
          <span>Email</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            autoComplete="email"
            required
          />
        </label>

        <label className="zb-dashLogin__field">
          <span>Password</span>
          <div className="zb-dashLogin__pw">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              required
            />
            <button
              className="zb-dashLogin__pwToggle"
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </label>

        {errorMsg ? <p className="zb-dashLogin__error">{errorMsg}</p> : null}

        <button className="zb-dashLogin__btn" type="submit" disabled={!canSubmit}>
          {submitting ? (mode === "signup" ? "Creating…" : "Signing in…") : mode === "signup" ? "Create account" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

