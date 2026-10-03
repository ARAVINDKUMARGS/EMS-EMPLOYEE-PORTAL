import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { jobs, candidates } from "../data/recruitmentData";
import { StatusPill } from "@/components/common/StatusPill";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DataTable,
  DataTableHead,
  DataTableBody,
  DataTableRow,
  DataTableHeadCell,
  DataTableCell,
} from "@/components/ui/data-table";

const stageTone = {
  Interviewing: "info",
  Screening: "warning",
  Offer: "success",
  Applied: "muted",
};

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const job = jobs.find((j) => j.id === Number(id));

  if (!job) {
    return <h2 className="text-lg">Job not found.</h2>;
  }

  const jobCandidates = candidates.filter((c) => c.jobId === job.id);

  return (
    <div>
      <Link to="/hr/recruitment" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Recruitment
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold">{job.title}</h1>
        <StatusPill status={job.status.toLowerCase()} tone={stageTone[job.status]} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="rounded-xl border border-border bg-card p-4">
          <h4 className="text-xs text-muted-foreground uppercase mb-1">Department</h4>
          <p className="font-medium">{job.department}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <h4 className="text-xs text-muted-foreground uppercase mb-1">Posted On</h4>
          <p className="font-medium">{job.posted}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <h4 className="text-xs text-muted-foreground uppercase mb-1">Total Candidates</h4>
          <p className="font-medium">{jobCandidates.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <h4 className="text-xs text-muted-foreground uppercase mb-1">Current Status</h4>
          <p className="font-medium">{job.status}</p>
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-4">Candidate Pipeline</h2>
      <Card className="overflow-hidden p-0">
        <DataTable className="border-0">
          <DataTableHead>
            <DataTableRow>
              <DataTableHeadCell>Name</DataTableHeadCell>
              <DataTableHeadCell>Experience</DataTableHeadCell>
              <DataTableHeadCell>Email</DataTableHeadCell>
              <DataTableHeadCell>Status</DataTableHeadCell>
              <DataTableHeadCell>Resume</DataTableHeadCell>
            </DataTableRow>
          </DataTableHead>
          <DataTableBody>
            {jobCandidates.map((c) => (
              <DataTableRow key={c.id}>
                <DataTableCell>{c.name}</DataTableCell>
                <DataTableCell>{c.experience}</DataTableCell>
                <DataTableCell className="text-muted-foreground">{c.email}</DataTableCell>
                <DataTableCell>
                  <StatusPill status={c.stage.toLowerCase()} tone={stageTone[c.stage]} />
                </DataTableCell>
                <DataTableCell>
                  <Button size="sm" onClick={() => navigate(`/hr/candidate/${c.id}`)}>
                    View Resume
                  </Button>
                </DataTableCell>
              </DataTableRow>
            ))}
          </DataTableBody>
        </DataTable>
      </Card>
    </div>
  );
}

export default JobDetails;