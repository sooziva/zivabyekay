import "./DashboardPageShell.css";

export default function DashboardPageShell({ title, subtitle, children, actions }) {
  return (
    <div className="zb-dpage">
      <header className="zb-dpage__header">
        <div className="zb-dpage__titleWrap">
          <h1 className="zb-dpage__title">{title}</h1>
          {subtitle ? <p className="zb-dpage__subtitle">{subtitle}</p> : null}
        </div>
        {actions ? <div className="zb-dpage__actions">{actions}</div> : null}
      </header>
      <div className="zb-dpage__body">{children}</div>
    </div>
  );
}

