import React, { useState } from "react";
// import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
// import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";


const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const roles = ["Admin", "Staff", "User"];

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setShowRoleDropdown(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call with timeout
    try {
      // In a real app, you would make an API call here
      // const response = await authApi.login({ email, password, role: selectedRole });

      // Mock users data - replace with actual API call in production
      const users = [
        { email: "admin@example.com", password: "123", role: "Admin" },
        { email: "staff@example.com", password: "123", role: "Staff" },
        { email: "user@example.com", password: "123", role: "User" },
      ];

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const user = users.find(
        (u) => u.email === email && u.password === password && u.role === selectedRole
      );

      if (user) {
        // Store user data in localStorage
        localStorage.setItem("role", user.role);
        localStorage.setItem("isAuthenticated", "true");

        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        // Redirect based on role
        setTimeout(() => {
          switch (user.role) {
            case "Admin":
              navigate("/admin/dashboard");
              break;
            case "Staff":
              navigate("/staff/tablesmanagement");
              break;
            case "User":
              navigate("/user/booktable");
              break;
            default:
              navigate("/");
          }
        }, 1500);
      } else {
        throw new Error("Invalid credentials or role");
      }
    } catch (error) {
      //   toast.error(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Load remembered email if exists
  React.useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light p-4">
      <div
        className="card shadow-lg w-100"
        style={{ maxWidth: "1000px", borderRadius: "2rem" }}
      >
        <div className="row g-0">
          {/* Left: Form */}
          <div className="col-12 col-md-6 p-5 text-center">
            <div className="d-flex justify-content-center align-items-center mb-4">
              <img
                src="https://i.postimg.cc/mZHz3k1Q/Whats-App-Image-2025-07-23-at-12-38-03-add5b5dd-removebg-preview-1.png" // Update with your logo path
                alt="logo"
                className="navbar-logo m-2"
                style={{ height: "50px" }}
              />


            </div>

            <h2 className="h5 text-secondary mt-3">Welcome Back!</h2>
            <p className="text-muted mb-4">Login to access your dashboard</p>

            <form onSubmit={handleLogin}>
              {/* Email */}
              <div className="mb-3 position-relative">
                <i className="bi bi-envelope position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary"></i>
                <input
                  type="email"
                  className="form-control ps-5"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div className="mb-3 position-relative">
                <i className="bi bi-lock position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary"></i>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control ps-5 pe-5"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength="3"
                />
                <i
                  className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"
                    } position-absolute top-50 end-0 translate-middle-y me-3 text-secondary cursor-pointer`}
                  role="button"
                  onClick={() => setShowPassword(!showPassword)}
                ></i>
              </div>

              {/* Role Dropdown */}
              <div className="mb-3 position-relative">
                <div
                  className="form-control d-flex justify-content-between align-items-center"
                  onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                  role="button"
                >
                  <span className={selectedRole ? "" : "text-muted"}>
                    {selectedRole || "Select Role"}
                  </span>
                  <i
                    className={`bi bi-chevron-down ${showRoleDropdown ? "rotate-180" : ""
                      }`}
                  ></i>
                </div>
                {showRoleDropdown && (
                  <div className="position-absolute w-100 border rounded bg-white mt-1 shadow-sm z-1">
                    {roles.map((role) => (
                      <div
                        key={role}
                        className="px-3 py-2 hover-bg-light cursor-pointer"
                        onClick={() => handleRoleSelect(role)}
                      >
                        {role}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Remember / Forgot */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <label className="form-check-label" htmlFor="rememberMe">
                    Remember Me
                  </label>
                </div>
                <Link to="/forgot-password" className=" text-decoration-none" style={{ color: "#1f2937" }}>
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="btn btn-warning w-100 text-white fw-semibold mb-3"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>

              <div className="text-center">
                <span className="text-muted">Don't have an account? </span>
                <Link to="/signup" className=" text-decoration-none fw-semibold" style={{ color: "#1f2937" }}>
                  Sign Up
                </Link>
              </div>
            </form>
          </div>

          {/* Right: Image */}
          <div className="col-md-6 d-none d-md-block">
            <div className="h-100 position-relative">

              {/* https://i.postimg.cc/GpVFJDn8/create-image-for-resturant-and-game-zone-pool-for-login-page-right-side-image-do-not-write-anything.jpg */}

              <img
                src="https://i.postimg.cc/GpVFJDn8/create-image-for-resturant-and-game-zone-pool-for-login-page-right-side-image-do-not-write-anything.jpg"
                alt="Childcare Illustration"
                className="img-fluid h-100 w-100 object-fit-cover"
                style={{
                  borderTopRightRadius: "2rem",
                  borderBottomRightRadius: "2rem",
                }}
              />

            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Login;