import React, { useState } from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LoginPage = () => {
  const [isRegister, setIsRegister] = useState(false); // Toggle between Login & Register
  const [role, setRole] = useState("user"); // Default role: User
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [name,setName] = useState("");
  const [loading,setLoading] = useState(false);
  const navigate = useNavigate();

  // Toggle form only for users
  const toggleForm = () => {
    if (role === "user") setIsRegister(!isRegister);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();  //preventing for reloading the page
    setLoading(true);

    const endpoint = isRegister ? "/patient/register" : "/patient/login";
    const data = { email, password, role };
    if (isRegister) data.name = name;

    try {
      console.log('Sending data:', data); //error
      const res = await axios.post(`/api${endpoint}`, data);
      // console.log('Response:', res.data);
      localStorage.setItem("token", res.data.token);
      toast("Login successful!");
      navigate(role === "admin" ? "/admin" : "/");
    } catch (error) {
      console.error('Full error:', error); // Error handeling
      console.error('Error response:', error.response?.data); // Add this
      alert(error.response?.data?.message || "Something went wrong!");
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

        {/* Role Selection (User / Admin) */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            className={`px-4 py-2 text-lg font-medium rounded-lg ${
              role === "user"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setRole("user")}
          >
            User
          </button>
          <button
            className={`px-4 py-2 text-lg font-medium rounded-lg ${
              role === "admin"
                ? "bg-red-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => {
              setRole("admin");
              setIsRegister(false); // Ensure admin cannot register
            }}
          >
            Admin
          </button>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Show Name field only when registering as User */}
          {isRegister && role === "user" && (
            <div>
              <label className="block text-gray-600 font-medium">Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e)=> setName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
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
              onChange={(e)=> setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e)=> setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3 mt-4 text-white font-semibold rounded-lg ${
              isRegister ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
            } transition ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={loading}
          >
            {loading ? "Processing..." : isRegister ? "Register" : "Login"}
          </button>
        </form>

        {/* Toggle between Login & Register (Only for Users) */}
        {role === "user" && (
          <p className="text-center text-gray-600 mt-4">
            {isRegister ? "Already have an account?" : "New user?"}{" "}
            <button
              onClick={toggleForm}
              className="text-blue-600 font-medium hover:underline"
            >
              {isRegister ? "Login here" : "Register here"}
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
