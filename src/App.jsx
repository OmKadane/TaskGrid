import AppLayout from "./components/AppLayout";
import ServerStatusDashboard from "./components/ServerStatusDashboard";
import TaskForm from "./components/TaskForm";
import TaskGrid from "./components/TaskGrid";

function App() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Server health strip */}
        <ServerStatusDashboard />

        {/* Task manager: form + grid side-by-side on wider screens */}
        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <TaskForm />
          <TaskGrid />
        </div>
      </div>
    </AppLayout>
  );
}

export default App;
