import { Navigate, Outlet, useLocation } from "react-router-dom";
import { authClient } from "../lib/auth-client";

export default function RequireDashboardAuth() {
  const location = useLocation();
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div style={{ padding: 24, color: "#EDE7DD", fontSize: "1rem", lineHeight: 1.35 }}>
        <p style={{ margin: 0, fontSize: "1.05rem" }}>Loading…</p>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/dashboard/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

