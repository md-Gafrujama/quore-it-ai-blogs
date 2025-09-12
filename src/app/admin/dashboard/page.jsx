"use client";
import React, { useEffect, useState } from "react";
import { assets } from "@/Assets/assets";
import BlogTableItem from "@/Components/AdminComponents/BlogTableItem";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";

import { baseURL } from '@/config/api';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    blogs: 0,
    comments: 0,
    recentBlogs: [],
  });

  const { axios } = useAppContext();
  const company = localStorage.getItem("company");

  const fetchDashboard = async () => {
    try {
      const { data } = await axios.get(
        `${baseURL}/api/admin/dashboard?company=${company}`
      );

      console.log(data);

      if (data.success) {
        setDashboardData({
         
          blogs: data.dashboardData.companyBlogCounts[company] || 0,
          comments: data.dashboardData.comments || 0,
          recentBlogs: data.dashboardData.recentBlogs || [],
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (company) {
      fetchDashboard();
    } else {
      toast.error("No company found in localStorage");
    }
  }, []);

  return (
    <div className="flex-1 p-4 md:p-10 bg-blue-50/50">
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all">
          <img src={assets.dashboard_icon_1} alt="" />
          <div>
            <p className="text-xl font-semibold text-gray-600">
              {dashboardData.blogs}
            </p>
            <p className="text-gray-400 font-light">{company} Blogs</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all">
          <img src={assets.dashboard_icon_2} alt="" />
          <div>
            <p className="text-xl font-semibold text-gray-600">
              {dashboardData.comments}
            </p>
            <p className="text-gray-400 font-light">Comments</p>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default Dashboard;
