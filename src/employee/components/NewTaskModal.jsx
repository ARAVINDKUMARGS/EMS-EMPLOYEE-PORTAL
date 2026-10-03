import { useState } from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

function NewTaskModal({ open, onClose, onAddTask }) {
  const [task, setTask] = useState({
    title: "",
    priority: "medium",
    status: "todo",
    dueDate: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!task.title || !task.dueDate) {
      setError("Please fill all required fields.");
      return;
    }

    onAddTask({
      id: Date.now(),
      ...task,
      completed: false,
    });

    setTask({
      title: "",
      priority: "medium",
      status: "todo",
      dueDate: "",
    });
    setError("");

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-xl">New Task</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="task-title">Task Title</FieldLabel>
            <Input
              id="task-title"
              type="text"
              placeholder="e.g. Prepare Q3 report"
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
            />
          </Field>

          <Field>
            <FieldLabel>Priority</FieldLabel>
            <Select
              value={task.priority}
              onValueChange={(value) => setTask({ ...task, priority: value })}
            >
              <SelectTrigger />
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel>Status</FieldLabel>
            <Select
              value={task.status}
              onValueChange={(value) => setTask({ ...task, status: value })}
            >
              <SelectTrigger />
              <SelectContent>
                <SelectItem value="todo">Todo</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel htmlFor="task-due-date">Due Date</FieldLabel>
            <Input
              id="task-due-date"
              type="date"
              value={task.dueDate}
              onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
            />
          </Field>

          <FieldError>{error}</FieldError>

          <Button type="submit" className="w-full" size="lg">
            Add Task
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default NewTaskModal;