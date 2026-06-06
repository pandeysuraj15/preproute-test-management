import api from "./axios";

export const login = (payload: { userId: string; password: string }) => {
  return api.post("/auth/login", payload);
};
