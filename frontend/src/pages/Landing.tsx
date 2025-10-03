import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b] px-4">
      <div className="bg-white max-w-lg w-full rounded-2xl shadow-xl p-10 text-center">
        <img
          src="/logo.png"
          alt="IT Support Logo"
          className="w-20 h-20 mx-auto mb-5 rounded-full shadow"
        />

        <h1 className="text-3xl font-extrabold text-blue-800 mb-2">
          Welcome to
        </h1>
        <h2 className="text-xl font-semibold text-gray-600 mb-4">
          <span className="text-cyan-500">CSIR-IITR Campus</span> <br />
          IT Support Service Portal
        </h2>

        <p className="text-sm text-gray-500 mb-6">
          Streamlined complaint tracking & support. Secure. Transparent. Reliable.
        </p>

        {!user ? (
          <>
            <button
              onClick={() => navigate("/login")}
              className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg mb-3 transition"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/register")}
              className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition"
            >
              Register
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full py-3 bg-[#002855] hover:bg-blue-900 text-white font-medium rounded-lg transition"
          >
            Go to Dashboard
          </button>
        )}

        <div className="mt-8 text-xs text-gray-400">
          © {new Date().getFullYear()} CRK Campus, CSIR-IITR. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Landing;
