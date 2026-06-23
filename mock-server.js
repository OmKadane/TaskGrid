import express from "express";
import cors from "cors";

const app = express();
const PORT = 8000;

const tasks = [];

app.use(cors());
app.use(express.json());

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

app.get("/tools/list-tasks", (_req, res) => {
  res.json(tasks);
});

app.listen(PORT, () => {
  console.log(`Mock server running at http://localhost:${PORT}`);
});
