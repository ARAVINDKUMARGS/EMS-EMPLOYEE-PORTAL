import { useState } from "react";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

function EmergencyForm() {

  const [formData, setFormData] = useState({
    primaryName: "John Smith",
    primaryRelation: "Father",
    primaryPhone: "+1 (555) 111-2222",
    primaryEmail: "john@example.com",

    secondaryName: "Emily Smith",
    secondaryRelation: "Mother",
    secondaryPhone: "+1 (555) 333-4444",
    secondaryEmail: "emily@example.com",

    address: "123 Innovation Drive, San Francisco"
  });

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Emergency Contact Saved Successfully!");
    console.log(formData);
  };

  return (
    <Card className="p-6">
      <div className="mb-5">
        <h2 className="text-base font-semibold">Emergency Contact</h2>
        <p className="text-sm text-muted-foreground">Manage emergency contact information</p>
      </div>

      <form onSubmit={handleSubmit}>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Primary Contact</h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel>Name</FieldLabel>
            <Input type="text" name="primaryName" value={formData.primaryName} onChange={handleChange} />
          </Field>

          <Field>
            <FieldLabel>Relationship</FieldLabel>
            <Input type="text" name="primaryRelation" value={formData.primaryRelation} onChange={handleChange} />
          </Field>

          <Field>
            <FieldLabel>Phone Number</FieldLabel>
            <Input type="text" name="primaryPhone" value={formData.primaryPhone} onChange={handleChange} />
          </Field>

          <Field>
            <FieldLabel>Email</FieldLabel>
            <Input type="email" name="primaryEmail" value={formData.primaryEmail} onChange={handleChange} />
          </Field>
        </div>

        <h3 className="mb-3 mt-6 text-sm font-semibold text-foreground">Secondary Contact</h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel>Name</FieldLabel>
            <Input type="text" name="secondaryName" value={formData.secondaryName} onChange={handleChange} />
          </Field>

          <Field>
            <FieldLabel>Relationship</FieldLabel>
            <Input type="text" name="secondaryRelation" value={formData.secondaryRelation} onChange={handleChange} />
          </Field>

          <Field>
            <FieldLabel>Phone Number</FieldLabel>
            <Input type="text" name="secondaryPhone" value={formData.secondaryPhone} onChange={handleChange} />
          </Field>

          <Field>
            <FieldLabel>Email</FieldLabel>
            <Input type="email" name="secondaryEmail" value={formData.secondaryEmail} onChange={handleChange} />
          </Field>
        </div>

        <Field className="mt-4">
          <FieldLabel>Address</FieldLabel>
          <Textarea name="address" rows="4" value={formData.address} onChange={handleChange} />
        </Field>

        <div className="mt-6 flex justify-end">
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Card>
  );
}

export default EmergencyForm;