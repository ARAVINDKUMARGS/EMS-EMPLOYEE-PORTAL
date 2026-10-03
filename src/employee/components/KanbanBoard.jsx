function KanbanBoard({ tasks, onToggleComplete }) {
  const todo = tasks.filter((task) => task.status === "todo");
  const inProgress = tasks.filter(
    (task) => task.status === "in-progress"
  );
  const done = tasks.filter((task) => task.status === "done");

  const columns = [
    {
      title: "Todo",
      color: "bg-slate-700",
      tasks: todo,
    },
    {
      title: "In Progress",
      color: "bg-blue-600",
      tasks: inProgress,
    },
    {
      title: "Done",
      color: "bg-green-600",
      tasks: done,
    },
  ];

  return (
    <div className="mt-8 grid gap-6 md:grid-cols-3">
      {columns.map((column) => (
        <div
          key={column.title}
          className="rounded-xl bg-[#111827] p-5"
        >
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {column.title}
            </h2>

            <span
              className={`${column.color} rounded-full px-3 py-1 text-sm`}
            >
              {column.tasks.length}
            </span>
          </div>

          <div className="space-y-4">
            {column.tasks.map((task) => (
              <div
                key={task.id}
                className="rounded-xl bg-slate-800 p-4 hover:bg-slate-700 transition"
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onToggleComplete(task.id)}
                    className="mt-1 h-4 w-4 shrink-0 accent-blue-600"
                  />

                  <h3
                    className={`font-semibold ${
                      task.completed
                        ? "line-through text-gray-500"
                        : "text-white"
                    }`}
                  >
                    {task.title}
                  </h3>
                </div>

                <div className="mt-4 flex justify-between text-sm text-gray-400">
                  <span>{task.priority}</span>

                  <span>{task.dueDate}</span>
                </div>
              </div>
            ))}

            {column.tasks.length === 0 && (
              <p className="text-center text-gray-500">
                No Tasks
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default KanbanBoard;