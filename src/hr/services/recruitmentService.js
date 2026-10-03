import api from "@/lib/api";

export const getJobs = () => api.get("/recruitment/jobs");
export const getJobDetails = (id) => api.get(`/recruitment/job/${id}`);
export const createJob = (payload) => api.post("/recruitment/job", payload);
export const getCandidates = () => api.get("/recruitment/candidates");
export const getCandidateDetails = (id) => api.get(`/recruitment/candidate/${id}`);
export const updateStage = (candidate_id, stage) => api.put("/recruitment/application/stage", { candidate_id, stage });
export const scheduleInterview = (payload) => api.post("/recruitment/interview", payload);
