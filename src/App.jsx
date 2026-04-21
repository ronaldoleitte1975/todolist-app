import react from '@vitejs/plugin-react'

// ─── Substitua pela URL gerada no API Gateway ───────────────
const API_URL = "https://lvfh1hfft9.execute-api.us-east-1.amazonaws.com/prod/tasks";
// ────────────────────────────────────────────────────────────

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Mono:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #f4f9f4; font-family: 'DM Mono', monospace; }

  .app {
    min-height: 100vh;
    background: #f4f9f4;
    color: #1a2e1a;
    padding: 48px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .header { width: 100%; max-width: 560px; margin-bottom: 48px; }

  .eyebrow {
    font-size: 10px; letter-spacing: 0.3em;
    color: #3a8c3a; text-transform: uppercase; margin-bottom: 10px;
  }

  h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(36px, 8vw, 56px);
    font-weight: 700; color: #1a2e1a; line-height: 1.0;
  }
  h1 span { color: #3a8c3a; font-style: italic; }

  .subtitle { margin-top: 12px; font-size: 12px; color: #7a9e7a; letter-spacing: 0.05em; }

  .input-row { width: 100%; max-width: 560px; display: flex; gap: 10px; margin-bottom: 32px; }

  .input-row input {
    flex: 1; background: #fff; border: 1px solid #c8e0c8;
    border-radius: 4px; padding: 14px 18px;
    font-family: 'DM Mono', monospace; font-size: 13px;
    color: #1a2e1a; outline: none; transition: border-color 0.2s;
    box-shadow: 0 1px 4px rgba(58,140,58,0.06);
  }
  .input-row input::placeholder { color: #aecbae; }
  .input-row input:focus { border-color: #3a8c3a; }
  .input-row input:disabled { opacity: 0.5; }

  .btn-add {
    background: #3a8c3a; color: #fff; border: none;
    border-radius: 4px; padding: 14px 22px;
    font-family: 'DM Mono', monospace; font-size: 18px;
    cursor: pointer; transition: background 0.2s, transform 0.1s;
  }
  .btn-add:hover:not(:disabled) { background: #2e7a2e; }
  .btn-add:active { transform: scale(0.97); }
  .btn-add:disabled { opacity: 0.5; cursor: not-allowed; }

  .filters { width: 100%; max-width: 560px; display: flex; gap: 6px; margin-bottom: 24px; }

  .filter-btn {
    background: none; border: 1px solid #c8e0c8; border-radius: 2px;
    padding: 6px 14px; font-family: 'DM Mono', monospace;
    font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase;
    color: #7a9e7a; cursor: pointer; transition: all 0.2s;
  }
  .filter-btn:hover { color: #1a2e1a; border-color: #7a9e7a; }
  .filter-btn.active { background: #e8f5e8; border-color: #3a8c3a; color: #3a8c3a; }

  .list { width: 100%; max-width: 560px; display: flex; flex-direction: column; gap: 8px; }

  .task {
    background: #fff; border: 1px solid #c8e0c8; border-radius: 4px;
    padding: 16px 18px; display: flex; align-items: center; gap: 14px;
    transition: border-color 0.2s, opacity 0.2s;
    animation: slideIn 0.2s ease;
    box-shadow: 0 1px 4px rgba(58,140,58,0.06);
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .task:hover { border-color: #3a8c3a; }
  .task.done { opacity: 0.5; }
  .task.loading { opacity: 0.6; pointer-events: none; }

  .check {
    width: 18px; height: 18px; border-radius: 50%;
    border: 1.5px solid #aecbae; cursor: pointer; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s; background: none;
  }
  .check:hover { border-color: #3a8c3a; }
  .check.checked { background: #3a8c3a; border-color: #3a8c3a; }
  .check svg { display: none; }
  .check.checked svg { display: block; }

  .task-text {
    flex: 1; font-size: 13px; letter-spacing: 0.02em;
    color: #2e4e2e; line-height: 1.5; word-break: break-word;
  }
  .task.done .task-text { text-decoration: line-through; color: #aecbae; }

  .task-text-edit {
    flex: 1; background: transparent; border: none;
    border-bottom: 1px solid #3a8c3a;
    font-family: 'DM Mono', monospace; font-size: 13px;
    color: #1a2e1a; outline: none; padding: 2px 0;
  }

  .actions { display: flex; gap: 6px; opacity: 0; transition: opacity 0.2s; }
  .task:hover .actions { opacity: 1; }

  .icon-btn {
    background: none; border: none; color: #aecbae;
    cursor: pointer; font-size: 12px; padding: 4px;
    transition: color 0.15s; font-family: 'DM Mono', monospace;
  }
  .icon-btn:hover.edit { color: #3a8c3a; }
  .icon-btn:hover.del  { color: #c05a5a; }

  .empty {
    text-align: center; padding: 48px 0; color: #aecbae;
    font-size: 12px; letter-spacing: 0.1em;
    border: 1px dashed #c8e0c8; border-radius: 4px;
  }

  .status-bar {
    width: 100%; max-width: 560px; margin-bottom: 16px;
    font-size: 11px; letter-spacing: 0.05em;
    min-height: 20px;
  }
  .error-msg { color: #c05a5a; }
  .loading-msg { color: #7a9e7a; }

  .stats {
    width: 100%; max-width: 560px; margin-top: 24px;
    display: flex; justify-content: space-between; align-items: center;
    font-size: 10px; letter-spacing: 0.1em; color: #7a9e7a; text-transform: uppercase;
  }

  .clear-btn {
    background: none; border: none;
    font-family: 'DM Mono', monospace; font-size: 10px;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: #7a9e7a; cursor: pointer; transition: color 0.2s;
    text-decoration: underline; text-underline-offset: 3px;
  }
  .clear-btn:hover { color: #c05a5a; }
`;

export default function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [loadingIds, setLoadingIds] = useState(new Set());
  const [globalLoading, setGlobalLoading] = useState(false);
  const [error, setError] = useState("");

  // ── Helpers ───────────────────────────────────────────────
  const setTaskLoading = (id, val) =>
    setLoadingIds(prev => { const s = new Set(prev); val ? s.add(id) : s.delete(id); return s; });

  const showError = (msg) => { setError(msg); setTimeout(() => setError(""), 4000); };

  // ── Listar tarefas (READ) ─────────────────────────────────
  useEffect(() => {
    const fetchTasks = async () => {
      setGlobalLoading(true);
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Erro ao carregar tarefas");
        setTasks(await res.json());
      } catch (e) {
        showError("Não foi possível carregar as tarefas.");
      } finally {
        setGlobalLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // ── Criar tarefa (CREATE) ─────────────────────────────────
  const add = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setInput("");
    const tempId = "temp-" + Date.now();
    const optimistic = { id: tempId, text: trimmed, done: false, createdAt: new Date().toISOString() };
    setTasks(prev => [optimistic, ...prev]);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed }),
      });
      if (!res.ok) throw new Error();
      const created = await res.json();
      setTasks(prev => prev.map(t => t.id === tempId ? created : t));
    } catch {
      setTasks(prev => prev.filter(t => t.id !== tempId));
      setInput(trimmed);
      showError("Erro ao criar tarefa.");
    }
  };

  // ── Atualizar done (UPDATE) ───────────────────────────────
  const toggle = async (task) => {
    setTaskLoading(task.id, true);
    const newDone = !task.done;
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, done: newDone } : t));
    try {
      const res = await fetch(`${API_URL}/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done: newDone }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setTasks(prev => prev.map(t => t.id === task.id ? updated : t));
    } catch {
      setTasks(prev => prev.map(t => t.id === task.id ? task : t));
      showError("Erro ao atualizar tarefa.");
    } finally {
      setTaskLoading(task.id, false);
    }
  };

  // ── Editar texto (UPDATE) ─────────────────────────────────
  const saveEdit = async (id) => {
    const trimmed = editText.trim();
    setEditId(null);
    if (!trimmed) return;
    const prev_task = tasks.find(t => t.id === id);
    if (trimmed === prev_task?.text) return;
    setTaskLoading(id, true);
    setTasks(prev => prev.map(t => t.id === id ? { ...t, text: trimmed } : t));
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setTasks(prev => prev.map(t => t.id === id ? updated : t));
    } catch {
      setTasks(prev => prev.map(t => t.id === id ? prev_task : t));
      showError("Erro ao editar tarefa.");
    } finally {
      setTaskLoading(id, false);
    }
  };

  // ── Remover tarefa (DELETE) ───────────────────────────────
  const remove = async (id) => {
    const backup = tasks.find(t => t.id === id);
    setTasks(prev => prev.filter(t => t.id !== id));
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
    } catch {
      setTasks(prev => [backup, ...prev]);
      showError("Erro ao remover tarefa.");
    }
  };

  const clearDone = () => tasks.filter(t => t.done).forEach(t => remove(t.id));

  const visible = tasks.filter(t =>
    filter === "all" ? true : filter === "active" ? !t.done : t.done
  );

  const doneCount = tasks.filter(t => t.done).length;

  return (
    <>
      <style>{style}</style>
      <div className="app">
        <div className="header">
          <p className="eyebrow">Gerenciador de tarefas</p>
          <h1>To-Do <span>List</span></h1>
          <p className="subtitle">— AWS API Gateway · Lambda · DynamoDB —</p>
        </div>

        <div className="input-row">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && add()}
            placeholder="Nova tarefa..."
            disabled={globalLoading}
          />
          <button className="btn-add" onClick={add} disabled={globalLoading || !input.trim()}>+</button>
        </div>

        <div className="status-bar">
          {error && <span className="error-msg">⚠ {error}</span>}
          {globalLoading && !error && <span className="loading-msg">Carregando tarefas...</span>}
        </div>

        <div className="filters">
          {["all", "active", "done"].map(f => (
            <button key={f} className={`filter-btn ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
              {f === "all" ? "Todas" : f === "active" ? "Pendentes" : "Concluídas"}
            </button>
          ))}
        </div>

        <div className="list">
          {visible.length === 0 ? (
            <div className="empty">{globalLoading ? "carregando..." : "nenhuma tarefa aqui"}</div>
          ) : visible.map(t => (
            <div key={t.id} className={`task ${t.done ? "done" : ""} ${loadingIds.has(t.id) ? "loading" : ""}`}>
              <div className={`check ${t.done ? "checked" : ""}`} onClick={() => toggle(t)}>
                <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                  <path d="M1 3L3.5 5.5L8 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>

              {editId === t.id ? (
                <input
                  className="task-text-edit"
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") saveEdit(t.id); if (e.key === "Escape") setEditId(null); }}
                  onBlur={() => saveEdit(t.id)}
                  autoFocus
                />
              ) : (
                <span className="task-text">{t.text}</span>
              )}

              <div className="actions">
                <button className="icon-btn edit" onClick={() => { setEditId(t.id); setEditText(t.text); }} title="Editar">✎</button>
                <button className="icon-btn del" onClick={() => remove(t.id)} title="Excluir">✕</button>
              </div>
            </div>
          ))}
        </div>

        <div className="stats">
          <span>{tasks.length - doneCount} pendente{tasks.length - doneCount !== 1 ? "s" : ""} · {doneCount} concluída{doneCount !== 1 ? "s" : ""}</span>
          {doneCount > 0 && <button className="clear-btn" onClick={clearDone}>limpar concluídas</button>}
        </div>
      </div>
    </>
  );
}
