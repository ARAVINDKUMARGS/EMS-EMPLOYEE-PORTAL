import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Building2, Plus, Pencil } from "lucide-react";
import { getDepartments, createDepartment, updateDepartment } from "../services/departmentsService";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function formatBudget(value) {
  if (value === null || value === undefined) return "—";
  const num = Number(value);
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return `${num}`;
}

export default function Departments() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingDept, setEditingDept] = useState(null); // null = creating new
  const [name, setName] = useState("");
  const [headName, setHeadName] = useState("");
  const [budget, setBudget] = useState("");

  async function loadDepartments() {
    setLoading(true);
    try {
      const res = await getDepartments();
      setDepartments(res.data);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Could not load departments");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDepartments();
  }, []);

  function openCreateModal() {
    setEditingDept(null);
    setName("");
    setHeadName("");
    setBudget("");
    setShowModal(true);
  }

  function openEditModal(dept) {
    setEditingDept(dept);
    setName(dept.name);
    setHeadName(dept.head_name || "");
    setBudget(dept.budget || "");
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Department name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = { name: name.trim(), head_name: headName.trim() || null, budget: budget || null };
      if (editingDept) {
        await updateDepartment(editingDept.id, payload);
        toast.success("Department updated");
      } else {
        await createDepartment(payload);
        toast.success("Department created");
      }
      setShowModal(false);
      loadDepartments();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save department");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Departments</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage teams and organizational structure</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus size={16} /> New Department
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : departments.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
          No departments yet. Add one to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {departments.map((d) => (
            <Card key={d.id} className="p-5">
              <div className="flex items-start justify-between">
                <div className="h-10 w-10 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
                  <Building2 size={20} />
                </div>
              </div>

              <h3 className="mt-4 text-lg font-semibold">{d.name}</h3>
              <p className="text-sm text-muted-foreground">
                Head: {d.head_name || "Unassigned"}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xl font-bold">{d.employee_count}</p>
                  <p className="text-xs text-muted-foreground">Employees</p>
                </div>
                <div>
                  <p className="text-xl font-bold">{formatBudget(d.budget)}</p>
                  <p className="text-xs text-muted-foreground">Budget</p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <Button variant="outline" className="flex-1" onClick={() => navigate("/hr/employees")}>
                  View Team
                </Button>
                <Button variant="outline" size="icon" onClick={() => openEditModal(d)}>
                  <Pencil size={14} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingDept ? "Edit Department" : "New Department"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field>
              <FieldLabel>Department Name</FieldLabel>
              <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </Field>

            <Field>
              <FieldLabel>Department Head</FieldLabel>
              <Input type="text" value={headName} onChange={(e) => setHeadName(e.target.value)} />
            </Field>

            <Field>
              <FieldLabel>Budget ($)</FieldLabel>
              <Input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} />
            </Field>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Saving..." : editingDept ? "Save Changes" : "Create Department"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}