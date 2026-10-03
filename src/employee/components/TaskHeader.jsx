import { List, KanbanSquare, Plus } from "lucide-react";

function TaskHeader({ view, setView }) {
  return (
    <div className="flex items-start justify-between">
      {/* Left Side */}
      <div>
        <h1 className="text-4xl font-bold text-white">
          Tasks
        </h1>

        <p className="mt-2 text-gray-400">
          Manage your work items and track progress
        </p>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">

        {/* Toggle Buttons */}
        <div className="flex rounded-xl bg-slate-800 p-1">

          <button
            onClick={() => setView("list")}
            className={`p-2 rounded-lg ${
              view === "list"
                ? "bg-blue-600 text-white"
                : "text-gray-400"
            }`}
          >
            <List size={20} />
          </button>

          <button
            onClick={() => setView("kanban")}
            className={`p-2 rounded-lg ${
              view === "kanban"
                ? "bg-blue-600 text-white"
                : "text-gray-400"
            }`}
          >
            <KanbanSquare size={20} />
          </button>

        </div>

        {/* New Task */}
        <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700">

          <Plus size={18} />

          New Task

        </button>

      </div>
    </div>
  );
}

export default TaskHeader;