import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTests } from "../api/testApi";
import "../styles/dashboard.scss";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import Loader from "../components/Loader";

const Dashboard = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    fetchTests();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (
        scrollTop + windowHeight >= documentHeight - 100 &&
        visibleCount < tests.length
      ) {
        setVisibleCount((prev) => prev + 10);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [visibleCount, tests.length]);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const response = await getTests();
      setTests(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }
  return (
    <div className="dashboard-container">
      <div className="dashboard-top">
        <h2>Test Management</h2>

        <button className="create-btn" onClick={() => navigate("/create-test")}>
          Create Test
        </button>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <h3>{tests.length}</h3>
          <p>Total Tests</p>
        </div>

        <div className="stat-card">
          <h3>{tests.filter((t: any) => t.status === "live").length}</h3>
          <p>Published</p>
        </div>

        <div className="stat-card">
          <h3>{tests.filter((t: any) => t.status === "draft").length}</h3>
          <p>Draft</p>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table dashboard-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Subject</th>
              <th>Type</th>
              <th>Questions</th>
              <th>Status</th>
              <th style={{ width: "220px" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {tests.slice(0, visibleCount).map((test: any) => (
              <tr key={test.id}>
                <td>{test.name}</td>

                <td>{test.subject}</td>

                <td>{test.type}</td>

                <td>{test.total_questions}</td>

                <td>
                  {!test.status ? (
                    ""
                  ) : (
                    <span
                      className={`status-badge ${
                        test.status === "live" ? "live" : "draft"
                      }`}
                    >
                      {test.status}
                    </span>
                  )}
                </td>

                <td>
                  <div className="action-buttons">
                    <button className="icon-btn view-btn">
                      <FaEye />
                    </button>

                    <button className="icon-btn edit-btn">
                      <FaEdit />
                    </button>

                    <button className="icon-btn delete-btn">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {visibleCount < tests.length && (
          <div className="text-center py-3">Loading more...</div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
