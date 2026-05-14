// server.js
const http = require("http");

const PORT = process.env.PORT || 3000;

// ── In-memory "database" (resets on restart — perfect for learning) ──
const todos = [
  { id: 1, task: "Learn Docker", done: false },
  { id: 2, task: "Set up GitHub Actions", done: true },
];
let nextId = 3;

// ── Simple router ────────────────────────────────────────────────────
function router(req, res) {
  const url  = req.url;
  const method = req.method;

  // Helper: send JSON response
  const json = (statusCode, data) => {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data, null, 2));
  };

  // Helper: read request body
  const body = (callback) => {
    let raw = "";
    req.on("data", chunk => (raw += chunk));
    req.on("end", () => {
      try { callback(JSON.parse(raw)); }
      catch { json(400, { error: "Invalid JSON" }); }
    });
  };

  // ── GET /health — used by Docker & load balancers to check the app ──
  if (method === "GET" && url === "/health") {
    return json(200, { status: "ok", uptime: process.uptime() });
  }

  // ── GET /todos — list all todos ──────────────────────────────────
  if (method === "GET" && url === "/todos") {
    return json(200, todos);
  }

  // ── POST /todos — create a new todo ─────────────────────────────
  if (method === "POST" && url === "/todos") {
    return body(({ task }) => {
      if (!task) return json(400, { error: "task is required" });
      const todo = { id: nextId++, task, done: false };
      todos.push(todo);
      json(201, todo);
    });
  }

  // ── PATCH /todos/:id — mark as done/undone ───────────────────────
  if (method === "PATCH" && url.startsWith("/todos/")) {
    const id   = parseInt(url.split("/")[2]);
    const todo = todos.find(t => t.id === id);
    if (!todo) return json(404, { error: "Todo not found" });
    return body(({ done }) => {
      todo.done = done ?? !todo.done;
      json(200, todo);
    });
  }

  // ── DELETE /todos/:id ────────────────────────────────────────────
  if (method === "DELETE" && url.startsWith("/todos/")) {
    const id  = parseInt(url.split("/")[2]);
    const idx = todos.findIndex(t => t.id === id);
    if (idx === -1) return json(404, { error: "Todo not found" });
    todos.splice(idx, 1);
    return json(200, { message: "Deleted" });
  }

  // ── 404 fallback ─────────────────────────────────────────────────
  json(404, { error: "Route not found" });
}

// ── Start server ─────────────────────────────────────────────────────
const server = http.createServer(router);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});