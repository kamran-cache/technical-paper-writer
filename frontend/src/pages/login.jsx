import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import login from "../assets/newlogin.jpg";
import { FaXmark } from "react-icons/fa6";
import axios from "axios";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [registerCredentials, setRegisterCredentials] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [alert, setAlert] = useState(false);
  const [mode, setMode] = useState("login");
  const navigate = useNavigate();

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://tpw.smartimmigrant.ai/api/v1/user/login",
        // `http://localhost:5000/api/v1/user/login`,
        credentials
      );

      window.localStorage.setItem("token", response.data.token);
      navigate("/paper-list");
      console.log("Login successful:", response.data);
    } catch (error) {
      console.error("Login error:", error);
      setAlert(true);
    }
  };

  const handleSubmitRegister = async (e) => {
    e.preventDefault();
    if (registerCredentials.password !== registerCredentials.confirmPassword) {
      console.error("Passwords do not match!");
      setAlert(true);
      return;
    }
    try {
      const response = await axios.post(
        "http://tpw.smartimmigrant.ai/api/v1/user/signup",
        registerCredentials
      );

      window.localStorage.setItem("token", response.data.token);
      navigate("/paper-list");
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const handleToggleLogin = () => {
    setMode("login");
  };

  const handleToggleSignup = () => {
    setMode("signup");
  };
  const handleAlert = () => {
    setAlert(false);
  };

  return (
    <>
      <div className="h-screen flex flex-col bg-gradient-to-b from-[#caf0f8] to-[#c1d3fe] items-center justify-center">
        {alert && (
          <>
            <div
              className="bg-red-100 w-full sm:w-[30rem] mb-3 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">
                Credentials are invalid !!!
              </span>
              <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                <FaXmark className="cursor-pointer" onClick={handleAlert} />
              </span>
            </div>
          </>
        )}
        <div className="container h-[85%] w-full sm:w-[85%] shadow-xl shadow-neutral-400 rounded-xl bg-white flex flex-col md:flex-row items-center justify-center place-items-center">
          <div className="left flex mb-4 md:mb-0">
            <img
              src={login}
              alt=""
              className="h-48 w-48 sm:h-96 sm:w-96 md:mr-[2rem]"
            />
          </div>
          <div className="right flex flex-col items-center justify-center">
            <div className="toggle flex mb-4">
              <div className="bg-neutral-100 rounded-lg shadow-lg shadow-neutral-400 h-16 w-full sm:w-64 flex items-center justify-between">
                <button
                  className={`ml-8 w-16 h-10 p-2 rounded-lg hover:bg-neutral-400 hover:text-neutral-50 transition-transform duration-500 ${
                    mode === "login" ? "bg-neutral-400 text-neutral-50" : ""
                  }`}
                  onClick={handleToggleLogin}
                >
                  Login
                </button>
                <hr className="h-10 w-[1px] bg-black" />
                <button
                  className={`mr-8 w-20 h-10 p-2 rounded-lg hover:bg-neutral-400 hover:text-neutral-50 ${
                    mode === "signup" ? "bg-neutral-400 text-neutral-50" : ""
                  }`}
                  onClick={handleToggleSignup}
                >
                  Register
                </button>
              </div>
            </div>
            <div className="card h-auto md:h-96 w-full sm:w-[30rem] bg-neutral-100 rounded-lg shadow-xl shadow-neutral-400 flex mt-4 p-6">
              {mode === "login" ? (
                <form
                  onSubmit={handleSubmitLogin}
                  className="flex flex-col items-center justify-center w-full"
                >
                  <div className="flex flex-col w-full">
                    <div className="flex flex-col sm:flex-row items-center mb-4">
                      <label htmlFor="email" className="text-lg w-full sm:w-32">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={credentials.email}
                        onChange={handleLoginChange}
                        required
                        className="flex-grow p-2 rounded-lg text-lg border-2 border-gray-600 mt-2 sm:mt-0"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row items-center mb-4">
                      <label
                        htmlFor="password"
                        className="text-lg w-full sm:w-32"
                      >
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={credentials.password}
                        onChange={handleLoginChange}
                        required
                        className="flex-grow p-2 rounded-lg text-lg border-2 border-gray-600 mt-2 sm:mt-0"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="h-10 w-32 bg-[#00072d] text-white rounded-lg mt-4"
                  >
                    Login
                  </button>
                </form>
              ) : (
                <form
                  onSubmit={handleSubmitRegister}
                  className="SignUp flex flex-col items-center justify-center w-full"
                >
                  <div className="flex flex-col w-full">
                    <div className="flex flex-col sm:flex-row items-center mb-4">
                      <label htmlFor="name" className="text-lg w-full sm:w-32">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={registerCredentials.name}
                        onChange={handleRegisterChange}
                        required
                        className="flex-grow p-2 rounded-lg text-lg border-2 border-gray-600 mt-2 sm:mt-0"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row items-center mb-4">
                      <label htmlFor="email" className="text-lg w-full sm:w-32">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={registerCredentials.email}
                        onChange={handleRegisterChange}
                        required
                        className="flex-grow p-2 rounded-lg text-lg border-2 border-gray-600 mt-2 sm:mt-0"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row items-center mb-4">
                      <label
                        htmlFor="password"
                        className="text-lg w-full sm:w-32"
                      >
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={registerCredentials.password}
                        onChange={handleRegisterChange}
                        required
                        className="flex-grow p-2 rounded-lg text-lg border-2 border-gray-600 mt-2 sm:mt-0"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row items-center mb-4">
                      <label
                        htmlFor="confirmPassword"
                        className="text-lg w-full sm:w-32"
                      >
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={registerCredentials.confirmPassword}
                        onChange={handleRegisterChange}
                        required
                        className="flex-grow p-2 rounded-lg text-lg border-2 border-gray-600 mt-2 sm:mt-0"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="h-10 w-32 bg-[#00072d] text-white rounded-lg mt-4"
                  >
                    Register
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
