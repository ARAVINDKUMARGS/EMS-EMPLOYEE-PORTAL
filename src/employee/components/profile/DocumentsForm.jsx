import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Upload, Eye, Download, FileText } from "lucide-react";
import UploadModal from "../documents/UploadModal";
import { getMyDocuments, FILE_BASE_URL } from "@/employee/services/documentsService";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

const categoryLabels = {
  contract: "contract",
  offer: "offer",
  legal: "legal",
  performance: "performance",
  payslip: "payslip",
  other: "other",
};

function DocumentsForm() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const loadDocuments = () => {
    setLoading(true);
    getMyDocuments()
      .then((res) => setDocuments(res.data))
      .catch((err) => toast.error(err.response?.data?.message || "Could not load documents"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const fileUrl = (doc) => `${FILE_BASE_URL}${doc.file_path}`;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold">My Documents</h2>
        <Button onClick={() => setShowModal(true)}>
          <Upload className="size-4" /> Upload
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : documents.length === 0 ? (
        <EmptyState icon={<FileText className="size-5" />} title="No Documents Found" />
      ) : (
        <Card className="divide-y divide-border overflow-hidden p-0">
          {documents.map((doc) => (
            <div className="flex items-center justify-between gap-4 px-4 py-3" key={doc.id}>
              <div className="flex min-w-0 items-center gap-3">
                <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
                  <FileText size={20} />
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-medium">{doc.document_name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {doc.file_size ? `${Math.round(doc.file_size / 1024)} KB` : ""}
                    {doc.uploaded_at ? ` • Added ${new Date(doc.uploaded_at).toLocaleDateString()}` : ""}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Badge variant="outline">{categoryLabels[doc.category] || doc.category}</Badge>
                  <a
                  className="grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
                  href={fileUrl(doc)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Eye size={16} />
                </a>
                  <a
                  className="grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
                  href={fileUrl(doc)}
                  download
                >
                  <Download size={16} />
                </a>
              </div>
            </div>
          ))}
        </Card>
      )}

      <UploadModal show={showModal} onClose={() => setShowModal(false)} onUploaded={loadDocuments} />
    </div>
  );
}

export default DocumentsForm;