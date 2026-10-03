import api from "@/lib/api";

export const getCourses = () => api.get("/training/courses");
export const getCourseDetails = (id) => api.get(`/training/courses/${id}`);
export const enrollCourse = (course_id) => api.post("/training/enroll", { course_id });
export const updateProgress = (course_id, progress) => api.put("/training/progress", { course_id, progress });
export const createCourse = (payload) => api.post("/training/course", payload);
