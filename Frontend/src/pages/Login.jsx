import React, { useState,useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LoginPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Add this useEffect to check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (token) {
        // Redirect to home page if already logged in
        navigate("/");
        toast.info("You are already logged in!");
      }
    };
    checkAuth();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = isRegister ? "/patient/register" : "/patient/login";
    const data = { email, password };
    if (isRegister) data.name = name;

    try {
      console.log("Sending data:", data);
      const res = await axios.post(`/api${endpoint}`, data);
      localStorage.setItem("token", res.data.token);
      // If you have user data, store it too
      if (res.data.user) {
        localStorage.setItem("userData", JSON.stringify(res.data.user));
      }
      navigate("/");
      window.location.reload();
      toast.success("Login successful!");
    } catch (error) {
      console.error("Error:", error.response?.data);
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-2xl rounded-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          {isRegister ? "User Registration" : "Login"}
        </h2>

        {/* Form */}
        <form
          className="flex flex-col gap-4 outline-none"
          onSubmit={handleSubmit}
        >
          {/* Show Name field only when registering */}
          {isRegister && (
            <div>
              <label className="block text-gray-600 font-medium">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-gray-600 font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border outline-none rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none focus:ring-blue-400"
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3 mt-4 text-white font-semibold rounded-lg ${
              isRegister
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700"
            } transition ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={loading}
          >
            {loading ? "Processing..." : isRegister ? "Register" : "Login"}
          </button>
        </form>

        {/* Toggle between Login & Register */}
        <p className="text-center text-gray-600 mt-4">
          {isRegister ? "Already have an account?" : "New user?"}{" "}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-blue-600 font-medium hover:underline"
          >
            {isRegister ? "Login here" : "Register here"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
