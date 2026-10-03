import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { candidates } from "../data/recruitmentData";

function CandidateDetails() {
  const { id } = useParams();
  const candidate = candidates.find((c) => c.id === Number(id));

  if (!candidate) {
    return <h2 className="text-lg">Candidate not found.</h2>;
  }

  const fields = [
    ["Age", candidate.age],
    ["Phone", candidate.phone],
    ["Email", candidate.email],
    ["Education", candidate.education],
    ["Experience", candidate.experience],
    ["Skills", candidate.skills],
    ["Current Company", candidate.company],
    ["Current CTC", candidate.ctc],
    ["Expected CTC", candidate.expected],
    ["Notice Period", candidate.notice],
    ["Interview Status", candidate.status],
  ];

  return (
    <div>
      <Link to="/hr/recruitment" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Recruitment
      </Link>

      <h1 className="text-2xl font-bold mb-6">{candidate.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map(([label, value]) => (
          <div key={label} className="rounded-xl border border-border bg-card p-4">
            <h4 className="text-xs text-muted-foreground uppercase mb-1">{label}</h4>
            <p className="font-medium">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CandidateDetails;