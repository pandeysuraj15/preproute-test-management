import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import { createQuestions } from "../api/questionApi";
import { updateTest, getTestById } from "../api/testApi";

const Questions = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [testDetails, setTestDetails] = useState<any>(null);

  const [questions, setQuestions] = useState([
    {
      question: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      correct_option: "option1",
      explanation: "",
      difficulty: "easy",
    },
  ]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        option1: "",
        option2: "",
        option3: "",
        option4: "",
        correct_option: "option1",
        explanation: "",
        difficulty: "easy",
      },
    ]);
  };

  useEffect(() => {
    fetchTestDetails();
  }, []);

  const fetchTestDetails = async () => {
    try {
      const response = await getTestById(id!);

      setTestDetails(response.data.data);

      console.log("Test Details:", response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (index: number, field: string, value: string) => {
    const updatedQuestions = [...questions];

    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value,
    };

    setQuestions(updatedQuestions);
  };

  const canProceed =
    questions.length > 0 &&
    questions.every(
      (q) =>
        q.question.trim() &&
        q.option1.trim() &&
        q.option2.trim() &&
        q.option3.trim() &&
        q.option4.trim()
    );

  const handleNext = async () => {
    try {
      const isInvalid = questions.some(
        (q) =>
          !q.question.trim() ||
          !q.option1.trim() ||
          !q.option2.trim() ||
          !q.option3.trim() ||
          !q.option4.trim()
      );

      if (isInvalid) {
        toast.error("Please fill all question fields");
        return;
      }

      const payload = {
        questions: questions.map((q) => ({
          type: "mcq",
          question: q.question,
          option1: q.option1,
          option2: q.option2,
          option3: q.option3,
          option4: q.option4,
          correct_option: q.correct_option,
          explanation: q.explanation,
          difficulty: q.difficulty,
          test_id: id,
          subject: testDetails?.subject,
        })),
      };

      const response = await createQuestions(payload);

      const questionIds = response.data.data.map((item: any) => item.id);

      await updateTest(id!, {
        questions: questionIds,
      });

      toast.success("Questions saved");

      navigate(`/preview/${id}`);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to save questions");
    }
  };
  return (
    <div className="questions-page">
      <div className="d-flex justify-content-between mb-4">
        <h3>Questions</h3>

        <button className="btn btn-primary" onClick={addQuestion}>
          + MCQ
        </button>
      </div>

      {questions.map((question, index) => (
        <div className="card p-3 mb-4" key={index}>
          <h5>Question {index + 1}</h5>

          <textarea
            className="form-control mb-3"
            placeholder="Question"
            value={question.question}
            onChange={(e) => handleChange(index, "question", e.target.value)}
          />

          <input
            className="form-control mb-2"
            placeholder="Option 1"
            value={question.option1}
            onChange={(e) => handleChange(index, "option1", e.target.value)}
          />

          <input
            className="form-control mb-2"
            placeholder="Option 2"
            value={question.option2}
            onChange={(e) => handleChange(index, "option2", e.target.value)}
          />

          <input
            className="form-control mb-2"
            placeholder="Option 3"
            value={question.option3}
            onChange={(e) => handleChange(index, "option3", e.target.value)}
          />

          <input
            className="form-control mb-2"
            placeholder="Option 4"
            value={question.option4}
            onChange={(e) => handleChange(index, "option4", e.target.value)}
          />

          <select
            className="form-control mb-3"
            value={question.correct_option}
            onChange={(e) =>
              handleChange(index, "correct_option", e.target.value)
            }
          >
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
            <option value="option4">Option 4</option>
          </select>

          <textarea
            className="form-control"
            placeholder="Explanation"
            value={question.explanation}
            onChange={(e) => handleChange(index, "explanation", e.target.value)}
          />
        </div>
      ))}

      <div className="text-end">
        <button
          className="btn btn-success"
          onClick={handleNext}
          disabled={!canProceed}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Questions;
