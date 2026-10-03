import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getUser } from "@/lib/auth";
import { getProfile, updateEmployment } from "@/employee/services/profileService";

import { Card } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

function EmploymentForm() {
  const currentUser = getUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    designation: "",
    department: "",
    employment_type: "Full Time",
    manager: "",
    date_of_joining: "",
    work_location: "",
    status: "Active",
  });

  useEffect(() => {
    if (!currentUser?.employee_id) return;
    getProfile(currentUser.employee_id)
      .then((res) => {
        const d = res.data;
        setForm({
          designation: d.designation || "",
          department: d.department || "",
          employment_type: d.employment_type || "Full Time",
          manager: d.manager || "",
          date_of_joining: d.date_of_joining ? d.date_of_joining.slice(0, 10) : "",
          work_location: d.work_location || "",
          status: d.status || "Active",
        });
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Could not load employment details");
      })
      .finally(() => setLoading(false));
  }, [currentUser?.employee_id]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateEmployment(currentUser.employee_id, form);
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save changes");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-5">
        <h2 className="text-base font-semibold">Employment Information</h2>
        <p className="text-sm text-muted-foreground">Manage your employment details</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel>Employee ID</FieldLabel>
            <Input type="text" value={currentUser?.employee_id || ""} readOnly className="bg-muted/40 text-muted-foreground" />
          </Field>

          <Field>
            <FieldLabel>Department</FieldLabel>
            <Input type="text" value={form.department} onChange={handleChange("department")} />
          </Field>

          <Field>
            <FieldLabel>Designation</FieldLabel>
            <Input type="text" value={form.designation} onChange={handleChange("designation")} />
          </Field>

          <Field>
            <FieldLabel>Employment Type</FieldLabel>
            <Select
              value={form.employment_type}
              onValueChange={(v) => setForm((prev) => ({ ...prev, employment_type: v }))}
            >
              <SelectTrigger />
              <SelectContent>
                <SelectItem value="Full Time">Full Time</SelectItem>
                <SelectItem value="Part Time">Part Time</SelectItem>
                <SelectItem value="Intern">Intern</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel>Manager</FieldLabel>
            <Input type="text" value={form.manager} onChange={handleChange("manager")} />
          </Field>

          <Field>
            <FieldLabel>Joining Date</FieldLabel>
            <Input type="date" value={form.date_of_joining} onChange={handleChange("date_of_joining")} />
          </Field>

          <Field>
            <FieldLabel>Work Location</FieldLabel>
            <Input type="text" value={form.work_location} onChange={handleChange("work_location")} />
          </Field>

          <Field>
            <FieldLabel>Status</FieldLabel>
            <Select value={form.status} onValueChange={(v) => setForm((prev) => ({ ...prev, status: v }))}>
              <SelectTrigger />
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="On Leave">On Leave</SelectItem>
                <SelectItem value="Resigned">Resigned</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default EmploymentForm;