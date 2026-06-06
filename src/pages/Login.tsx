import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "../api/authApi";
import { loginSchema, type LoginFormData } from "../utils/validationSchemas";
import LoginIllustration from "../assets/images/login-illustration.png";

const Login = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await login(data);
      console.log("response: ", response.data);

      const { token, user } = response.data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Login successful");

      navigate("/create-test");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-page">
      <div className="container-fluid h-100">
        <div className="row h-100">
          {/* Left Section */}
          <div className="col-lg-6 d-none d-lg-flex login-left">
            <div className="illustration-wrapper">
              <img
                src={LoginIllustration}
                alt="illustration"
                className="img-fluid"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="col-lg-6 col-12 d-flex align-items-center justify-content-center">
            <div className="login-card">
              <div className="logo mb-4">
                <h3>Preproute</h3>
              </div>

              <h5 className="fw-bold mb-2">Login</h5>

              <p className="text-muted small mb-4">
                Use your company provided login credentials
              </p>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label className="form-label">User ID</label>

                  <input
                    className="form-control"
                    placeholder="Enter User ID"
                    {...register("userId")}
                  />

                  {errors.userId && (
                    <small className="text-danger">
                      {errors.userId.message}
                    </small>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>

                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter Password"
                    {...register("password")}
                  />

                  {errors.password && (
                    <small className="text-danger">
                      {errors.password.message}
                    </small>
                  )}
                </div>

                <div className="mb-4">
                  <a href="#" className="forgot-password">
                    Forgot Password?
                  </a>
                </div>

                <button
                  type="submit"
                  className="btn login-btn w-100"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Logging In..." : "Login"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
