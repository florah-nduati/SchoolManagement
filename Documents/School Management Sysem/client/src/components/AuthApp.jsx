import { useEffect, useState } from "react";
import AuthForm from "./AuthForm.jsx";
import UserPanel from "./UserPanel.jsx";
import MessageBox from "./MessageBox.jsx";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/auth";

function AuthApp() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("");
  const [roles, setRoles] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      loadProfile(token);
    } else {
      localStorage.removeItem("token");
      setUser(null);
    }
  }, [token]);

  const fetchRoles = async () => {
    try {
      const res = await fetch(`${API_BASE}/roles`);
      const data = await res.json();
      setRoles(data);
      if (data.length > 0 && !roleId) {
        setRoleId(data[0].id);
      }
    } catch (err) {
      setMessage("Unable to load roles.");
    }
  };

  const loadProfile = async (tokenValue) => {
    try {
      const res = await fetch(`${API_BASE}/me`, {
        headers: { Authorization: `Bearer ${tokenValue}` },
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
      } else {
        setMessage(data.message || "Unable to load user profile.");
        setToken("");
      }
    } catch (err) {
      setMessage("Unable to load profile.");
      setToken("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const endpoint = mode === "login" ? "login" : "register";
    const payload = { email, password };
    if (mode === "register") payload.roleId = roleId;

    try {
      const res = await fetch(`${API_BASE}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || data.error || "Request failed.");
      } else {
        setToken(data.token);
        setEmail("");
        setPassword("");
      }
    } catch (err) {
      setMessage("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const callProtected = async (path) => {
    if (!token) return;
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${API_BASE}/${path}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        const details = data.message || JSON.stringify(data);
        setMessage(details + (data.users ? ` Users: ${data.users.length}` : ""));
      } else {
        setMessage(data.message || "Access denied");
      }
    } catch (err) {
      setMessage("Unable to contact server.");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken("");
    setUser(null);
    setMessage("Logged out.");
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-3xl rounded-[32px] border border-slate-200 bg-white/90 p-8 shadow-2xl shadow-slate-200/40 backdrop-blur-sm">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-sky-600">School RBAC</p>
          <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">Auth + Authorization</h1>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">Use role-based permissions to test access in a simple student/grade/user management flow.</p>
        </div>

        {!token ? (
          <AuthForm
            mode={mode}
            setMode={setMode}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            roleId={roleId}
            setRoleId={setRoleId}
            roles={roles}
            onSubmit={handleSubmit}
            loading={loading}
          />
        ) : (
          <UserPanel user={user} onAction={callProtected} onLogout={logout} loading={loading} />
        )}

        <MessageBox message={message} />
      </div>
    </div>
  );
}

export default AuthApp;
