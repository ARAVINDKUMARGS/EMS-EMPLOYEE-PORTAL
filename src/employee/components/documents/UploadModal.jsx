import { useState } from "react";
import { toast } from "sonner";
import { uploadDocument } from "@/employee/services/documentsService";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

function UploadModal({ show, onClose, onUploaded }) {
  const [document, setDocument] = useState("");
  const [category, setCategory] = useState("other");
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setDocument("");
    setCategory("other");
    setFile(null);
  };

  const handleSave = async () => {
    if (document === "") {
      toast.error("Enter Document Name");
      return;
    }
    if (!file) {
      toast.error("Please choose a file");
      return;
    }

    const formData = new FormData();
    formData.append("document", document);
    formData.append("category", category);
    formData.append("file", file);

    setSaving(true);
    try {
      await uploadDocument(formData);
      toast.success("Document uploaded successfully");
      resetForm();
      onUploaded();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={show} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Upload Document</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Field>
            <FieldLabel htmlFor="doc-name">Document Name</FieldLabel>
            <Input
              id="doc-name"
              type="text"
              placeholder="Enter Document Name"
              value={document}
              onChange={(e) => setDocument(e.target.value)}
            />
          </Field>

          <Field>
            <FieldLabel>Category</FieldLabel>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger />
              <SelectContent>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="offer">Offer</SelectItem>
                <SelectItem value="legal">Legal</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
                <SelectItem value="payslip">Payslip</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel htmlFor="doc-file">Choose File</FieldLabel>
            <input
              id="doc-file"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full rounded-lg border border-input bg-input/30 text-sm text-foreground file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-xs file:font-medium file:text-primary-foreground hover:file:bg-primary/80"
            />
          </Field>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default UploadModal;