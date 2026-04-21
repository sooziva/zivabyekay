import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authClient } from "../../../lib/auth-client";
import "./DashboardLogin.css";

export default function DashboardLogin() {
  const navigate = useNavigate();
  const { data: session, isPending } = authClient.useSession();
  const [mode, setMode] = useState("signin"); // "signin" | "signup" | "forgot"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    if (submitting) return false;
    if (!email.trim()) return false;
    if (mode !== "forgot" && !password.trim()) return false;
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
    setSuccessMsg("");
    setSubmitting(true);
    try {
      const { error } = await (mode === "forgot"
        ? authClient.requestPasswordReset({
            email: email.trim(),
            redirectTo: "/dashboard/reset-password",
          })
        : mode === "signup"
          ? authClient.signUp.email({
              name: name.trim(),
              email: email.trim(),
              password,
              callbackURL: "/dashboard",
            })
          : authClient.signIn.email({
              email: email.trim(),
              password,
              callbackURL: "/dashboard",
            }));
      if (error) {
        setErrorMsg(
          error.message ||
            (mode === "signup"
              ? "Sign up failed"
              : mode === "forgot"
                ? "Could not send reset email"
                : "Sign in failed")
        );
        return;
      }
      if (mode === "forgot") {
        setSuccessMsg("If an account exists for that email, you’ll receive a reset link shortly.");
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
                setSuccessMsg("");
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
                setSuccessMsg("");
              }}
            >
              Sign up
            </button>
          </div>

          <p className="zb-dashLogin__title">
            {mode === "signup" ? "Create dashboard account" : mode === "forgot" ? "Reset your password" : "Dashboard sign in"}
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

        {mode !== "forgot" ? (
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
        ) : null}

        {errorMsg ? <p className="zb-dashLogin__error">{errorMsg}</p> : null}
        {successMsg ? <p className="zb-dashLogin__success">{successMsg}</p> : null}

        <button className="zb-dashLogin__btn" type="submit" disabled={!canSubmit}>
          {submitting
            ? mode === "signup"
              ? "Creating…"
              : mode === "forgot"
                ? "Sending…"
                : "Signing in…"
            : mode === "signup"
              ? "Create account"
              : mode === "forgot"
                ? "Send reset link"
                : "Sign in"}
        </button>

        <div className="zb-dashLogin__footer">
          {mode === "signin" ? (
            <button
              type="button"
              className="zb-dashLogin__link"
              onClick={() => {
                setMode("forgot");
                setErrorMsg("");
                setSuccessMsg("");
              }}
            >
              Forgot password?
            </button>
          ) : mode === "forgot" ? (
            <button
              type="button"
              className="zb-dashLogin__link"
              onClick={() => {
                setMode("signin");
                setErrorMsg("");
                setSuccessMsg("");
              }}
            >
              Back to sign in
            </button>
          ) : null}
        </div>
      </form>
    </div>
  );
}

