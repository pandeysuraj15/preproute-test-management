import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { getTestById, updateTest } from "../api/testApi";
import { fetchQuestions } from "../api/questionApi";
import { MdEdit } from "react-icons/md";
import diceImage from "../assets/images/ar_stickers.png";
import cognition from "../assets/images/cognition.png";
import { CiSquareQuestion, CiStopwatch } from "react-icons/ci";
import { BiBarChartAlt2 } from "react-icons/bi";
import Loader from "../components/Loader";
// import LoginIllustration from "../assets/images/login-illustration.png";

const Preview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [test, setTest] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    fetchPreviewData();
  }, []);

  const fetchPreviewData = async () => {
    try {
      const testResponse = await getTestById(id!);
      console.log("testResponse: ", testResponse);

      const testData = testResponse.data.data;

      setTest(testData);

      if (testData.questions?.length) {
        const questionResponse = await fetchQuestions(testData.questions);

        setQuestions(questionResponse.data.data || []);
      }
    } catch (error) {
      console.log(error);

      toast.error("Failed to load preview");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    try {
      await updateTest(id!, {
        status: "live",
      });

      toast.success("Test Published Successfully");

      navigate("/dashboard");
    } catch (error) {
      console.log(error);

      toast.error("Failed to publish test");
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="preview-page">
      <div className="page-header mb-4">
        <h5>Test Creation</h5>
      </div>

      <div className="d-flex gap-4 align-items-baseline">
        <span>Test Created</span>
        <div className="completion-badge mb-4">
          ✅ All {questions.length} Questions Done
        </div>
      </div>

      <div className="summary-card mb-4">
        <div className="summary-header mb-2">
          <span className="test-type">{test?.type}</span>

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
            <h5>{test?.name}</h5>
            <div className="difficulty-badge ms-2">
              <img src={cognition} />
              <span>{test?.difficulty}</span>
            </div>
          </div>
        </div>

        <div className="summary-content">
          <div className="d-flex align-items-center">
            <span className="summary-content-label">Subject</span>
            <span>:</span>
            <span className="subject-value ms-1">{test?.subject}</span>
          </div>

          <div className="d-flex align-items-center my-2">
            <span className="summary-content-label">Topic</span>
            <span>:</span>

            <div className="ms-2 d-flex flex-wrap gap-2">
              {test?.topics?.map((topic: string, index: number) => (
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
              {test?.sub_topics?.length ? (
                test.sub_topics.map((subTopic: string, index: number) => (
                  <span key={index} className="tag-badge">
                    {subTopic}
                  </span>
                ))
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
              {test?.total_time} Min
            </div>
            <div className="summary-stats-divider">|</div>
            <div className="d-flex align-items-center gap-1">
              <CiSquareQuestion className="summary-stats-icon" />
              {test?.total_questions} Qs
            </div>
            <div className="summary-stats-divider">|</div>
            <div className="d-flex align-items-center gap-1">
              <BiBarChartAlt2 className="summary-stats-icon" />
              {test?.total_marks} Marks
            </div>
          </div>
        </div>
      </div>

      <div className="schedule-card">
        <div className="publish-tabs">
          <button className="active">Publish Now</button>
          <button>Schedule Publish</button>
        </div>

        <div className="schedule-section">
          <h6>Select Date and Time</h6>

          <div className="schedule-row">
            <input type="text" placeholder="Select Date" />
            <input type="text" placeholder="Select Time" />
          </div>
        </div>

        <div className="live-until-section">
          <h6>Live Until</h6>

          <p>
            Choose how long this test should remain available on the platform.
          </p>

          <div className="duration-grid">
            <label>
              <input type="radio" name="duration" />
              Always Available
            </label>

            <label>
              <input type="radio" name="duration" />3 Weeks
            </label>

            <label>
              <input type="radio" name="duration" />1 Week
            </label>

            <label>
              <input type="radio" name="duration" />1 Month
            </label>

            <label>
              <input type="radio" name="duration" />2 Weeks
            </label>

            <label>
              <input type="radio" name="duration" defaultChecked />
              Custom Duration
            </label>
          </div>

          <div className="schedule-row mt-3">
            <input type="text" placeholder="Select End Date" />
            <input type="text" placeholder="Select End Time" />
          </div>
        </div>

        <div className="schedule-footer">
          <button
            className="cancel-btn"
            onClick={() => navigate(`/questions/${id}`)}
          >
            Cancel
          </button>
          <button className="confirm-btn" onClick={handlePublish}>
            Confirm
          </button>
        </div>
      </div>

      {/* <div className="confirmation-actions">
        <button
          className="btn btn-light"
          onClick={() => navigate(`/questions/${id}`)}
        >
          Back
        </button>

        <button className="btn btn-primary publish-btn" onClick={handlePublish}>
          Publish Test
        </button>
      </div> */}
    </div>
  );
};

export default Preview;
