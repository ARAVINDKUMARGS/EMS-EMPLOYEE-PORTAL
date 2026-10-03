import api from "@/lib/api";

export const getContacts = () => api.get("/chat/contacts");
export const getMessages = (contactId) => api.get(`/chat/messages/${contactId}`);
export const sendMessage = (payload) => api.post("/chat/message", payload);
export const clearConversation = (contactId) => api.delete(`/chat/conversation/${contactId}`);
