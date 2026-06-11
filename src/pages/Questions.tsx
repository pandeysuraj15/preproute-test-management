/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { createQuestions } from "../api/questionApi";
import { updateTest, getTestById } from "../api/testApi";
import { CiSquareQuestion, CiStopwatch } from "react-icons/ci";
import { BiBarChartAlt2 } from "react-icons/bi";
import { MdEdit } from "react-icons/md";
import diceImage from "../assets/images/ar_stickers.png";
import cognition from "../assets/images/cognition.png";
import { BsDownload } from "react-icons/bs";
import { GoPlus } from "react-icons/go";
import { FaRegTrashAlt } from "react-icons/fa";
import Loader from "../components/Loader";
import { FiChevronDown } from "react-icons/fi";

const Questions = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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
      topic: "",
      sub_topic: "",
      media_url: "",
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
        topic: "",
        sub_topic: "",
        media_url: "",
      },
    ]);
  };

  useEffect(() => {
    fetchTestDetails();
  }, []);

  const fetchTestDetails = async () => {
    try {
      setLoading(true);
      const response = await getTestById(id!);

      setTestDetails(response.data.data);

      console.log("Test Details:", response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return <Loader />;
  }
  return (
    <div className="questions-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <p className="text-muted mb-1">
            Test Creation / Create Test / Chapter Wise
          </p>
        </div>

        <button
          className="btn btn-primary px-4"
          onClick={handleNext}
          disabled={!canProceed}
        >
          Publish
        </button>
      </div>
      <div className="summary-card mb-4">
        <div className="summary-header mb-2">
          <span className="test-type">{testDetails?.type}</span>

          <button
            className="preview-edit-btn"
            onClick={() => navigate(`/questions/${id}`)}
          >
            <MdEdit className="edit-icon" />
          </button>
        </div>

        <div className="d-flex align-items-center">
          <div className="d-flex align-items-center gap-2">
            <img src={diceImage} />
            <h5>{testDetails?.name}</h5>
            <div className="difficulty-badge ms-2">
              <img src={cognition} />
              <span>{testDetails?.difficulty}</span>
            </div>
          </div>
        </div>

        <div className="summary-content">
          <div className="d-flex align-items-center">
            <span className="summary-content-label">Subject</span>
            <span>:</span>
            <span className="subject-value ms-1">{testDetails?.subject}</span>
          </div>

          <div className="d-flex align-items-center my-2">
            <span className="summary-content-label">Topic</span>
            <span>:</span>

            <div className="ms-2 d-flex flex-wrap gap-2">
              {testDetails?.topics?.map((topic: string, index: number) => (
                <span key={index} className="tag-badge">
                  {topic}
                </span>
              ))}
            </div>
          </div>

          <div className="d-flex align-items-center">
            <span className="summary-content-label">Sub Topic</span>
            <span>:</span>

            <div className="ms-2 d-flex flex-wrap gap-2">
              {testDetails?.sub_topics?.length ? (
                testDetails.sub_topics.map(
                  (subTopic: string, index: number) => (
                    <span key={index} className="tag-badge">
                      {subTopic}
                    </span>
                  )
                )
              ) : (
                <span className="text-muted">-</span>
              )}
            </div>
          </div>
        </div>

        <div className="summary-stats">
          <div className="summary-stats-parent">
            <div className="d-flex align-items-center gap-1">
              <CiStopwatch className="summary-stats-icon" />
              {testDetails?.total_time} Min
            </div>
            <div className="summary-stats-divider">|</div>
            <div className="d-flex align-items-center gap-1">
              <CiSquareQuestion className="summary-stats-icon" />
              {testDetails?.total_questions} Qs
            </div>
            <div className="summary-stats-divider">|</div>
            <div className="d-flex align-items-center gap-1">
              <BiBarChartAlt2 className="summary-stats-icon" />
              {testDetails?.total_marks} Marks
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>
          <b className="question-title">Question {questions.length}</b>/
          <span style={{ color: "#afa9ed" }}>
            {testDetails?.total_questions}
          </span>
        </h5>

        <div>
          <button className="btn mcq-btn me-2" onClick={addQuestion}>
            <GoPlus className="me-1" />
            MCQ
          </button>

          <button className="btn mcq-btn">
            <BsDownload className="me-1" />
            CSV
          </button>
        </div>
      </div>

      <div className="mb-3">
        <span className="delete-edit">
          <FaRegTrashAlt /> Delete All Edits
        </span>
      </div>

      {/* Questions */}

      {questions.map((question, index) => (
        <div key={index} className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            {/* Question */}

            <textarea
              rows={8}
              className="form-control mb-4"
              placeholder="Type Here"
              value={question.question}
              onChange={(e) => handleChange(index, "question", e.target.value)}
            />

            {/* Options */}

            <h6 className="mb-3">Type the options below</h6>

            <input
              className="form-control mb-3"
              placeholder="Type Option here"
              value={question.option1}
              onChange={(e) => handleChange(index, "option1", e.target.value)}
            />

            <input
              className="form-control mb-3"
              placeholder="Type Option here"
              value={question.option2}
              onChange={(e) => handleChange(index, "option2", e.target.value)}
            />

            <input
              className="form-control mb-3"
              placeholder="Type Option here"
              value={question.option3}
              onChange={(e) => handleChange(index, "option3", e.target.value)}
            />

            <input
              className="form-control mb-4"
              placeholder="Type Option here"
              value={question.option4}
              onChange={(e) => handleChange(index, "option4", e.target.value)}
            />

            {/* Correct Option */}

            <div className="mb-4">
              <label className="form-label">Correct Option</label>

              <select
                className="form-control"
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
            </div>

            {/* Solution */}

            <div className="mb-4">
              <label className="form-label">Add Solution</label>

              <textarea
                rows={8}
                className="form-control"
                placeholder="Type here"
                value={question.explanation}
                onChange={(e) =>
                  handleChange(index, "explanation", e.target.value)
                }
              />
            </div>

            {/* Question Settings */}

            <h6 className="mb-4">Question settings</h6>

            <div>
              <div>
                <label className="mb-2">Level of Difficulty</label>
                <div className="select-wrapper">
                  <select
                    className="form-control placeholder-select"
                    value={question.difficulty}
                    onChange={(e) =>
                      handleChange(index, "difficulty", e.target.value)
                    }
                  >
                    <option value="easy">Select from Drop-down</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="difficult">Difficult</option>
                  </select>
                  <FiChevronDown className="select-arrow" />{" "}
                </div>
              </div>

              <div>
                <label className="my-2">Topic</label>
                <div className="select-wrapper">
                  <select className="form-control placeholder-select">
                    <option>Select from Drop-down</option>
                  </select>
                  <FiChevronDown className="select-arrow" />{" "}
                </div>
              </div>

              <div>
                <label className="my-2">Sub-topic</label>
                <div className="select-wrapper">
                  <select className="form-control placeholder-select">
                    <option>Select from Drop-down</option>
                  </select>
                  <FiChevronDown className="select-arrow" />{" "}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="d-flex justify-content-between mt-4">
        <button
          className="btn exit-test-btn"
          onClick={() => navigate("/dashboard")}
        >
          Exit Test Creation
        </button>

        <button
          className="btn btn-primary px-5"
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
