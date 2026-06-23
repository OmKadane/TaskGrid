import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export const getServerStatus = () => api.get("/tools/status");

export const addTask = ({ title, description }) =>
  api.post("/tools/add-task", { title, description });

export const listTasks = () => api.get("/tools/list-tasks");

export default api;
