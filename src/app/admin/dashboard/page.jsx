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
    subscriptions: 0,
    recentBlogs: [],
  });

  const { axios } = useAppContext();
  const company = localStorage.getItem("company");

  const fetchDashboard = async () => {
    try {
      // Fetch dashboard data
      const { data } = await axios.get(
        `${baseURL}/api/admin/dashboard?company=${company}`
      );

      // Fetch subscriber count separately
      const token = localStorage.getItem('token');
      const emailsResponse = await axios.get(`${baseURL}/api/admin/emails`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          company: company,
        },
      });

      console.log('Dashboard data:', data);
      console.log('Emails data:', emailsResponse.data);

      if (data.success) {
        const subscriberCount = emailsResponse.data.success 
          ? emailsResponse.data.emails.filter(e => e.company === company).length 
          : 0;

        setDashboardData({
          blogs: data.dashboardData.companyBlogCounts[company] || 0,
          comments: data.dashboardData.comments || 0,
          subscriptions: subscriberCount,
          recentBlogs: data.dashboardData.recentBlogs || [],
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error);
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
    <div className="flex-1 p-4 md:p-10 bg-gradient-to-br from-teal-50 to-emerald-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Dashboard</h1>
          <p className="text-gray-600 text-lg">Welcome back! Here's what's happening with your content.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 max-w-5xl">
          <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-3xl shadow-xl border border-gray-200 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-5xl font-bold text-[#00D7A4] mb-2">
                  {dashboardData.blogs}
                </p>
                <p className="text-gray-600 font-semibold text-lg">Total Blogs</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-[#00D7A4] to-teal-600 rounded-2xl group-hover:scale-110 transition-transform shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-3xl shadow-xl border border-gray-200 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-5xl font-bold text-blue-600 mb-2">
                  {dashboardData.comments}
                </p>
                <p className="text-gray-600 font-semibold text-lg">Comments</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl group-hover:scale-110 transition-transform shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-3xl shadow-xl border border-gray-200 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-5xl font-bold text-purple-600 mb-2">
                  {dashboardData.subscriptions}
                </p>
                <p className="text-gray-600 font-semibold text-lg">Subscriptions</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl group-hover:scale-110 transition-transform shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

   
        </div>

        {/* Quick Actions
        <div className="bg-white rounded-2xl shadow-lg border border-teal-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 bg-gradient-to-br from-teal-500 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105">
              <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-sm font-medium">New Blog</span>
            </button>
            <button className="p-4 bg-gradient-to-br from-cyan-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105">
              <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="text-sm font-medium">Analytics</span>
            </button>
            <button className="p-4 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105">
              <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
              <span className="text-sm font-medium">Comments</span>
            </button>
            <button className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105">
              <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm font-medium">Settings</span>
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Dashboard;
