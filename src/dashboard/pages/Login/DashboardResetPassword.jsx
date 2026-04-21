import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { authClient } from "../../../lib/auth-client";
import "./DashboardLogin.css";

export default function DashboardResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = (searchParams.get("token") || "").trim();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const canSubmit = useMemo(() => {
    if (submitting) return false;
    if (!token) return false;
    if (!newPassword.trim() || !confirmPassword.trim()) return false;
    if (newPassword !== confirmPassword) return false;
    return true;
  }, [submitting, token, newPassword, confirmPassword]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    if (!token) {
      setErrorMsg("Missing reset token. Please request a new reset link.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await authClient.resetPassword({
        newPassword,
        token,
      });
      if (error) {
        setErrorMsg(error.message || "Could not reset password.");
        return;
      }
      setSuccessMsg("Password updated. You can sign in now.");
      window.setTimeout(() => navigate("/dashboard/login", { replace: true }), 900);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="zb-dashLogin">
      <form className="zb-dashLogin__card" onSubmit={onSubmit}>
        <div className="zb-dashLogin__header">
          <p className="zb-dashLogin__title">Reset password</p>
          <p className="zb-dashLogin__sub">Ziva by Ekay</p>
        </div>

        <label className="zb-dashLogin__field">
          <span>New password</span>
          <input
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            type="password"
            autoComplete="new-password"
            required
          />
        </label>

        <label className="zb-dashLogin__field">
          <span>Confirm new password</span>
          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            autoComplete="new-password"
            required
          />
        </label>

        {errorMsg ? <p className="zb-dashLogin__error">{errorMsg}</p> : null}
        {successMsg ? <p className="zb-dashLogin__success">{successMsg}</p> : null}

        <button className="zb-dashLogin__btn" type="submit" disabled={!canSubmit}>
          {submitting ? "Updating…" : "Update password"}
        </button>

        <div className="zb-dashLogin__footer">
          <Link className="zb-dashLogin__link" to="/dashboard/login">
            Back to sign in
          </Link>
        </div>
      </form>
    </div>
  );
}

