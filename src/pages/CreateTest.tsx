import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getSubjects,
  getTopicsBySubject,
  getSubTopics,
} from "../api/masterApi";

import { createTest } from "../api/testApi";
import { toast } from "react-toastify";

const CreateTest = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [subTopics, setSubTopics] = useState<any[]>([]);

  const [testType, setTestType] = useState("mock");

  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    topic: "",
    subTopic: "",
    total_time: "",
    difficulty: "easy",
    wrong_marks: -1,
    unattempt_marks: 0,
    correct_marks: 5,
    total_questions: "",
    total_marks: "",
  });

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await getSubjects();
      setSubjects(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubjectChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const subjectId = e.target.value;

    setFormData((prev) => ({
      ...prev,
      subject: subjectId,
      topic: "",
      subTopic: "",
    }));

    setTopics([]);
    setSubTopics([]);

    try {
      const response = await getTopicsBySubject(subjectId);
      setTopics(response?.data?.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleTopicChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const topicId = e.target.value;

    setFormData((prev) => ({
      ...prev,
      topic: topicId,
      subTopic: "",
    }));

    try {
      const response = await getSubTopics([topicId]);

      setSubTopics(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleNext = async () => {
    setLoading(true);
    try {
      if (
        !formData.name ||
        !formData.subject ||
        !formData.topic ||
        !formData.total_time ||
        !formData.total_questions ||
        !formData.total_marks
      ) {
        toast.error("Please fill all required fields");
        return;
      }

      const payload = {
        name: formData.name,
        type: testType,
        subject: formData.subject,
        topics: [formData.topic],
        sub_topics: formData.subTopic ? [formData.subTopic] : [],
        correct_marks: Number(formData.correct_marks),
        wrong_marks: Number(formData.wrong_marks),
        unattempt_marks: Number(formData.unattempt_marks),
        difficulty: formData.difficulty,
        total_time: Number(formData.total_time),
        total_marks: Number(formData.total_marks),
        total_questions: Number(formData.total_questions),
        status: "draft",
      };

      const response = await createTest(payload);

      toast.success("Test created successfully");

      const testId = response.data.data.id;

      navigate(`/questions/${testId}`);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create test");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-test">
      <div className="breadcrumb">
        Test Creation / Create Test / Chapter Wise
      </div>

      <div className="tabs">
        <button
          className={testType === "mock" ? "active-tab" : ""}
          onClick={() => setTestType("mock")}
        >
          Chapter Wise
        </button>

        <button
          // className={testType === "pyq" ? "active-tab" : ""}
          // onClick={() => setTestType("pyq")}
          disabled
        >
          PYQ
        </button>

        <button
          // className={testType === "mock" ? "active-tab" : ""}
          // onClick={() => setTestType("mock")}
          disabled
        >
          Mock Test
        </button>
      </div>

      <div className="row mt-4">
        <div className="col-md-6">
          <label className="mb-2">Subject</label>

          <select
            className="form-control"
            value={formData.subject}
            name="subject"
            onChange={handleSubjectChange}
          >
            <option value="">Select Subject</option>

            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-6">
          <label className="mb-2">Name of Test</label>

          <input
            className="form-control"
            placeholder="Enter test name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-6">
          <label className="mb-2">Topic</label>

          <select
            className="form-control"
            value={formData.topic}
            onChange={handleTopicChange}
          >
            <option value="">Select Topic</option>

            {topics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-6">
          <label className="mb-2">Sub Topic</label>

          <select
            className="form-control"
            name="subTopic"
            value={formData.subTopic}
            onChange={handleChange}
          >
            <option value="">Select Sub Topic</option>

            {subTopics.map((subTopic: any) => (
              <option key={subTopic.id} value={subTopic.id}>
                {subTopic.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-6">
          <label className="mb-2">Duration (Minutes)</label>

          <input
            className="form-control"
            type="number"
            name="total_time"
            value={formData.total_time}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-6">
          <label className="mb-2">Test Difficulty Level</label>

          <div className="d-flex justify-content-between mt-2">
            <div>
              <input
                type="radio"
                name="difficulty"
                value="easy"
                checked={formData.difficulty === "easy"}
                onChange={handleChange}
              />
              <span className="ms-2">Easy</span>
            </div>
            <div>
              <input
                type="radio"
                name="difficulty"
                value="medium"
                checked={formData.difficulty === "medium"}
                onChange={handleChange}
              />
              <span className="ms-2">Medium</span>
            </div>
            <div>
              <input
                type="radio"
                name="difficulty"
                value="difficult"
                checked={formData.difficulty === "difficult"}
                onChange={handleChange}
              />
              <span className="ms-2">Difficult</span>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <label className="mb-4">Marking Scheme:</label>
        <div className="col-md-2">
          <label className="mb-2">Wrong Answer</label>

          <input
            type="number"
            className="form-control"
            name="wrong_marks"
            value={formData.wrong_marks}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-2">
          <label className="mb-2">Unattempted</label>

          <input
            type="number"
            className="form-control"
            name="unattempt_marks"
            value={formData.unattempt_marks}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-2">
          <label className="mb-2">Correct Answer</label>

          <input
            type="number"
            className="form-control"
            name="correct_marks"
            value={formData.correct_marks}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-3">
          <label className="mb-2">No Of Questions</label>

          <input
            type="number"
            className="form-control"
            name="total_questions"
            value={formData.total_questions}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-3">
          <label className="mb-2">Total Marks</label>

          <input
            type="number"
            className="form-control"
            name="total_marks"
            value={formData.total_marks}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="d-flex justify-content-end mt-5">
        <button
          className="btn btn-cancel me-3"
          onClick={() => navigate("/dashboard")}
        >
          Cancel
        </button>

        <button
          type="button"
          className="btn btn-next"
          onClick={handleNext}
          disabled={loading}
        >
          {loading ? "Creating..." : "Next"}
        </button>
      </div>
    </div>
  );
};

export default CreateTest;
