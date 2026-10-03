import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getUser } from "@/lib/auth";
import { getProfile, updatePersonal } from "@/employee/services/profileService";

import { Card } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

function PersonalForm() {
  const currentUser = getUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "Male",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    country: "",
  });

  useEffect(() => {
    if (!currentUser?.employee_id) return;
    getProfile(currentUser.employee_id)
      .then((res) => {
        const d = res.data;
        setForm({
          name: d.name || "",
          email: d.email || "",
          phone: d.phone || "",
          dob: d.dob ? d.dob.slice(0, 10) : "",
          gender: d.gender || "Male",
          address: d.address || "",
          city: d.city || "",
          state: d.state || "",
          zip_code: d.zip_code || "",
          country: d.country || "",
        });
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Could not load profile");
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
      const res = await updatePersonal(currentUser.employee_id, form);
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
        <h2 className="text-base font-semibold">Personal Information</h2>
        <p className="text-sm text-muted-foreground">
          Update your personal details and contact information
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel>Full Name</FieldLabel>
            <Input type="text" value={form.name} onChange={handleChange("name")} />
          </Field>

          <Field>
            <FieldLabel>Email Address</FieldLabel>
            <Input type="email" value={form.email} onChange={handleChange("email")} />
          </Field>

          <Field>
            <FieldLabel>Phone Number</FieldLabel>
            <Input type="text" value={form.phone} onChange={handleChange("phone")} />
          </Field>

          <Field>
            <FieldLabel>Date of Birth</FieldLabel>
            <Input type="date" value={form.dob} onChange={handleChange("dob")} />
          </Field>

          <Field>
            <FieldLabel>Gender</FieldLabel>
            <Select value={form.gender} onValueChange={(v) => setForm((prev) => ({ ...prev, gender: v }))}>
              <SelectTrigger />
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field className="sm:col-span-2">
            <FieldLabel>Address</FieldLabel>
            <Input type="text" value={form.address} onChange={handleChange("address")} />
          </Field>

          <Field>
            <FieldLabel>City</FieldLabel>
            <Input type="text" value={form.city} onChange={handleChange("city")} />
          </Field>

          <Field>
            <FieldLabel>State</FieldLabel>
            <Input type="text" value={form.state} onChange={handleChange("state")} />
          </Field>

          <Field>
            <FieldLabel>ZIP Code</FieldLabel>
            <Input type="text" value={form.zip_code} onChange={handleChange("zip_code")} />
          </Field>

          <Field>
            <FieldLabel>Country</FieldLabel>
            <Input type="text" value={form.country} onChange={handleChange("country")} />
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

export default PersonalForm;