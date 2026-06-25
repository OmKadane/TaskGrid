import express from "express";
import cors from "cors";

const app = express();
const PORT = 8000;

const tasks = [];

app.use(cors());
app.use(express.json());
app.set("json spaces", 2); // pretty-print all JSON responses

app.get("/", (_req, res) => {
  res.json({
    name: "TaskGrid Mock API",
    version: "1.0.0",
    status: "running",
    endpoints: [
      { method: "GET",    path: "/tools/status" },
      { method: "GET",    path: "/tools/list-tasks" },
      { method: "POST",   path: "/tools/add-task" },
      { method: "DELETE", path: "/tools/delete-task/:id" },
    ],
    ui: "http://localhost:5173",
  });
});

app.get("/tools/status", (_req, res) => {
  res.json({ status: "online" });
});

app.post("/tools/add-task", (req, res) => {
  const { title, description } = req.body ?? {};

  if (!title || !description) {
    return res.status(400).json({
      error: "Both title and description are required.",
    });
  }

  const task = {
    id: tasks.length + 1,
    title,
    description,
    createdAt: new Date().toISOString(),
  };

  tasks.push(task);
  res.status(201).json(task);
});

app.delete("/tools/delete-task/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `Task #${id} not found.` });
  }

  const [deleted] = tasks.splice(index, 1);
  res.json({ message: `Task #${id} deleted.`, task: deleted });
});

app.get("/tools/list-tasks", (_req, res) => {
  res.json(tasks);
});

app.listen(PORT, () => {
  console.log(`Mock server running at http://localhost:${PORT}`);
});
