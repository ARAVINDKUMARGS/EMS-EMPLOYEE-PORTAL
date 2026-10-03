import { useState } from "react";
import { MoreVertical, Trash2 } from "lucide-react";

function TaskList({ tasks, onToggleComplete, onDeleteTask }) {
  const [openMenu, setOpenMenu] = useState(null);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-orange-500/20 text-orange-400";
      case "medium":
        return "bg-blue-500/20 text-blue-400";
      case "urgent":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-green-500/20 text-green-400";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "todo":
        return "bg-gray-600 text-white";
      case "in-progress":
        return "bg-blue-600 text-white";
      case "done":
        return "bg-green-600 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-slate-800">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center justify-between border-b border-slate-800 bg-[#111827] px-5 py-4 last:border-b-0 hover:bg-slate-800/60"
        >
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggleComplete(task.id)}
              className="h-4 w-4 shrink-0 accent-blue-600"
            />

            <div>
              <h3
                className={`text-[15px] font-semibold leading-tight ${
                  task.completed
                    ? "line-through text-gray-500"
                    : "text-white"
                }`}
              >
                {task.title}
              </h3>

              <div className="mt-2 flex items-center gap-4">
                <span
                  className={`rounded-md px-2.5 py-0.5 text-[11px] font-semibold ${getPriorityColor(
                    task.priority
                  )}`}
                >
                  {task.priority.toUpperCase()}
                </span>

                <span className="text-xs text-gray-400">
                  Due {task.dueDate}
                </span>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-6">
            <span
              className={`rounded-md px-2.5 py-1 text-xs font-medium ${getStatusColor(
                task.status
              )}`}
            >
              {task.status}
            </span>

            {/* Three-dot Menu */}
            <div className="relative">
              <button
                onClick={() =>
                  setOpenMenu(openMenu === task.id ? null : task.id)
                }
                className="rounded-lg p-2 hover:bg-slate-700"
              >
                <MoreVertical size={18} />
              </button>

              {openMenu === task.id && (
                <div className="absolute right-0 z-20 mt-2 w-40 rounded-lg border border-slate-700 bg-slate-800 shadow-lg">
                  <button
                    onClick={() => {
                      onDeleteTask(task.id);
                      setOpenMenu(null);
                    }}
                    className="flex w-full items-center gap-2 px-4 py-3 text-red-400 hover:bg-slate-700"
                  >
                    <Trash2 size={16} />
                    Delete Task
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TaskList;