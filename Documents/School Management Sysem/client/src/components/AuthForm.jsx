function AuthForm({
  mode,
  setMode,
  email,
  setEmail,
  password,
  setPassword,
  roleId,
  setRoleId,
  roles,
  onSubmit,
  loading,
}) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 shadow-sm shadow-slate-200/50">
      <div className="mb-6 flex items-center justify-between gap-3 rounded-full bg-white p-1 shadow-inner shadow-slate-100">
        <button
          type="button"
          className={`flex-1 rounded-full py-3 text-sm font-semibold transition ${mode === "login" ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900"}`}
          onClick={() => setMode("login")}
        >
          Login
        </button>
        <button
          type="button"
          className={`flex-1 rounded-full py-3 text-sm font-semibold transition ${mode === "register" ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900"}`}
          onClick={() => setMode("register")}
        >
          Register
        </button>
      </div>

      <form className="space-y-5" onSubmit={onSubmit}>
        <label className="block text-sm font-medium text-slate-700">
          Email
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Password
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          />
        </label>

        {mode === "register" && (
          <label className="block text-sm font-medium text-slate-700">
            Role
            <select
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            >
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </label>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {loading ? "Please wait..." : mode === "login" ? "Login" : "Register"}
        </button>
      </form>
    </section>
  );
}

export default AuthForm;
