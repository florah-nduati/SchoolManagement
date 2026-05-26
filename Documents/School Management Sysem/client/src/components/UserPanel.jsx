function UserPanel({ user, onAction, onLogout, loading }) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 shadow-sm shadow-slate-200/50">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-sky-600">Signed in as</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">{user?.email}</h2>
          <p className="text-sm text-slate-600">Role: {user?.role?.name || "Unknown"}</p>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
        >
          Logout
        </button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => onAction("students")}
          className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          disabled={loading}
        >
          Students
        </button>
        <button
          type="button"
          onClick={() => onAction("grades")}
          className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          disabled={loading}
        >
          Grades
        </button>
        <button
          type="button"
          onClick={() => onAction("users")}
          className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          disabled={loading}
        >
          User Management
        </button>
      </div>
    </section>
  );
}

export default UserPanel;
