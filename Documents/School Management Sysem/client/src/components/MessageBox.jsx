function MessageBox({ message }) {
  if (!message) return null;

  return (
    <div className="mt-6 rounded-3xl border border-slate-200 bg-sky-50 px-5 py-4 text-sm text-slate-900 shadow-sm shadow-slate-100">
      {message}
    </div>
  );
}

export default MessageBox;
