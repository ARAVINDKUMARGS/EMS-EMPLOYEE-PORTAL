import { Eye, Download, FileText } from "lucide-react";
import { FILE_BASE_URL } from "@/employee/services/documentsService";

const categoryLabels = {
  contract: "contract",
  offer: "offer",
  legal: "legal",
  performance: "performance",
  payslip: "payslip",
  other: "other",
};

function DocumentsTable({ documents }) {
  const fileUrl = (doc) => `${FILE_BASE_URL}${doc.file_path}`;

  return (
    <div className="documents-list">
      {documents.length === 0 ? (
        <div className="empty-state">No Documents Found</div>
      ) : (
        documents.map((doc) => (
          <div className="document-item" key={doc.id}>
            <div className="document-left">
              <div className="document-icon">
                <FileText size={20} />
              </div>
              <div>
                <h3>{doc.document_name}</h3>
                <p>
                  {doc.file_size ? `${Math.round(doc.file_size / 1024)} KB` : ""}
                  {doc.uploaded_at ? ` • Added ${new Date(doc.uploaded_at).toLocaleDateString()}` : ""}
                </p>
              </div>
            </div>
            <div className="document-right">
              <span className="category-tag">{categoryLabels[doc.category] || doc.category}</span>
              <a className="action-btn" href={fileUrl(doc)} target="_blank" rel="noreferrer">
                <Eye size={16} />
              </a>
              <a className="action-btn" href={fileUrl(doc)} download>
                <Download size={16} />
              </a>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default DocumentsTable;