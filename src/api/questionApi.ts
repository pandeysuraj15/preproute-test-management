import api from "./axios";

export const createQuestions = (payload: any) => {
  return api.post("/questions/bulk", payload);
};

export const fetchQuestions = (question_ids: string[]) => {
  return api.post("/questions/fetchBulk", {
    question_ids,
  });
};
