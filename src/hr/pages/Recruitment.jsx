import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Users, Briefcase, CalendarClock, CheckCircle2, Plus } from "lucide-react";
import { StatCard } from "@/components/common/StatCard";
import { StatusPill } from "@/components/common/StatusPill";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { getJobs, getCandidates, createJob } from "../services/recruitmentService";

const stageTone = {
  Interviewing: "info",
  Screening: "warning",
  Offer: "success",
  Applied: "muted",
};

function Recruitment() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showJobModal, setShowJobModal] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("Engineering");
  const [location, setLocation] = useState("San Francisco, CA");
  const [salary, setSalary] = useState("$120k - $150k");

  const fetchData = async () => {
    try {
      const [jobsRes, candRes] = await Promise.all([getJobs(), getCandidates()]);
      setJobs(jobsRes.data);
      setCandidates(candRes.data);
    } catch (err) {
      console.error("Fetch recruitment error:", err);
      toast.error("Failed to load recruitment data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePostJob = async () => {
    if (!title.trim()) {
      toast.error("Enter a job title");
      return;
    }

    try {
      await createJob({
        title: title.trim(),
        department_name: department,
        location,
        salary_range: salary,
      });
      toast.success("Job opening posted successfully!");
      setShowJobModal(false);
      setTitle("");
      fetchData();
    } catch (err) {
      toast.error("Failed to post job opening");
    }
  };

  const pipelineCounts = candidates.reduce((acc, c) => {
    acc[c.stage] = (acc[c.stage] || 0) + 1;
    return acc;
  }, {});

  if (loading) {
    return <p className="text-sm text-muted-foreground p-6">Loading recruitment pipeline...</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Recruitment</h1>
          <p className="text-sm text-muted-foreground mt-1">Job openings and candidate pipeline</p>
        </div>
        <Button onClick={() => setShowJobModal(true)}>
          <Plus size={16} /> Post Job
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Candidates" value={candidates.length} icon={<Users size={16} />} />
        <StatCard label="Open Roles" value={jobs.length} icon={<Briefcase size={16} />} />
        <StatCard label="Interviews Scheduled" value={pipelineCounts["Interviewing"] || 0} icon={<CalendarClock size={16} />} />
        <StatCard label="Offers Extended" value={pipelineCounts["Offer"] || 0} icon={<CheckCircle2 size={16} />} tone="success" />
      </div>

      <h2 className="text-lg font-semibold mb-4">Active Job Openings</h2>
      <div className="space-y-3 mb-8">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div key={job.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
              <div>
                <h3 className="font-medium">{job.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{job.department} • Posted {job.posted}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">{job.candidateIds?.length || 0} Candidates</span>
                <StatusPill status={(job.status || "active").toLowerCase()} tone={stageTone[job.status] || "info"} />
                <Button variant="outline" size="sm" onClick={() => navigate(`/hr/job/${job.id}`)}>
                  View
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No active job openings.</p>
        )}
      </div>

      <h2 className="text-lg font-semibold mb-4">Candidate Pipeline</h2>
      <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Applied" value={pipelineCounts["Applied"] || 0} icon={<Users size={16} />} />
        <StatCard label="Screening" value={pipelineCounts["Screening"] || 0} icon={<Users size={16} />} tone="warning" />
        <StatCard label="Interview" value={pipelineCounts["Interviewing"] || 0} icon={<Users size={16} />} tone="info" />
        <StatCard label="Offers" value={pipelineCounts["Offer"] || 0} icon={<Users size={16} />} tone="success" />
      </div>

      <div className="space-y-3">
        {candidates.slice(0, 6).map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between rounded-xl border border-border bg-card p-4 cursor-pointer hover:bg-accent"
            onClick={() => navigate(`/hr/candidate/${c.id}`)}
          >
            <div>
              <h3 className="font-medium">{c.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {jobs.find((j) => j.id === c.jobId)?.title || "Candidate"}
              </p>
            </div>
            <StatusPill status={(c.stage || "applied").toLowerCase()} tone={stageTone[c.stage] || "muted"} />
          </div>
        ))}
      </div>

      {/* Post Job Modal */}
      <Dialog open={showJobModal} onOpenChange={setShowJobModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Post New Job Opening</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Field>
              <FieldLabel>Job Title</FieldLabel>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Senior Backend Engineer" />
            </Field>

            <Field>
              <FieldLabel>Department</FieldLabel>
              <Input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="e.g. Engineering" />
            </Field>

            <Field>
              <FieldLabel>Location</FieldLabel>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. San Francisco, CA" />
            </Field>

            <Field>
              <FieldLabel>Salary Range</FieldLabel>
              <Input value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="e.g. $120k - $150k" />
            </Field>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowJobModal(false)}>
              Cancel
            </Button>
            <Button onClick={handlePostJob}>Post Opening</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Recruitment;