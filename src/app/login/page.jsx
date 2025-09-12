"use client";
import React, { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { baseURL } from '@/config/api';
// const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

const Login = () => {
  const { axios, setToken } = useAppContext();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin"); // default role = admin

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Dynamically set endpoint
      const endpoint =`${baseURL}/api/admin/login`


      const { data } = await axios.post(endpoint, { email, password });

      if (data.success) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", email);
        localStorage.setItem("company", data.company);
        axios.defaults.headers.common["Authorization"] = data.token;

       
          router.push("/admin/dashboard");

      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-sm p-6 max-md:m-6 border border-[#5044E5]/30 shadow-xl shadow-[#5044E5]/15 rounded-lg">
        <div className="flex flex-col items-center justify-center">
          <div className="w-full py-6 text-center">
            <h1 className="text-3xl font-bold">
              <span className="text-[#5044E5]">{role === "admin" ? "Admin" : "Super Admin"}</span> Login
            </h1>
            <p className="font-light">
              Enter your credentials to access the Admin panel
            </p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="mt-6 w-full sm:max-w-md text-gray-600"
          >
            {/* Role selection */}
            <div className="flex gap-6 mb-6 justify-center">

            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label>Email</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                required
                placeholder="your email id"
                className="border-b-2 border-gray-300 p-2 outline-none mb-6"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col">
              <label>Password</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                required
                placeholder="your password"
                className="border-b-2 border-gray-300 p-2 outline-none mb-6"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 font-medium bg-[#5044E5] text-white rounded cursor-pointer hover:bg-[#5044E5]/90 transition-all"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
