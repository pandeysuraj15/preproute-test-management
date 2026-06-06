import api from "./axios";

export const getTests = () => {
  return api.get("/tests");
};

export const createTest = (payload: any) => {
  return api.post("/tests", payload);
};

export const updateTest = (id: string, payload: any) => {
  return api.put(`/tests/${id}`, payload);
};

export const getTestById = (id: string) => {
  return api.get(`/tests/${id}`);
};
