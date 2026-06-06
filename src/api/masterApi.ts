import api from "./axios";

export const getSubjects = () => {
  return api.get("/subjects");
};

export const getTopicsBySubject = (subjectId: string) => {
  return api.get(`/topics/subject/${subjectId}`);
};

export const getSubTopics = (topicIds: string[]) => {
  return api.post("/sub-topics/multi-topics", {
    topicIds,
  });
};
