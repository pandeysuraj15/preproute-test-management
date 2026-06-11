import { FiChevronRight } from "react-icons/fi";

interface Props {
  questions: any[];
  activeQuestion: number;
  setActiveQuestion: (index: number) => void;
}

const QuestionNavigator = ({
  questions,
  activeQuestion,
  setActiveQuestion,
}: Props) => {
  return (
    <div className="question-nav">
      <h6>Question Creation</h6>

      <p>Total Questions : {questions.length}</p>

      {questions.map((_, index) => (
        <button
          key={index}
          className={`question-nav-item ${
            activeQuestion === index ? "active" : ""
          }`}
          onClick={() => setActiveQuestion(index)}
        >
          <span>Question {index + 1}</span>
          <FiChevronRight />
        </button>
      ))}
    </div>
  );
};

export default QuestionNavigator;
