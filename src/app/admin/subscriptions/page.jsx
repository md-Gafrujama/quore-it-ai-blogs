'use client'

import SubsTableItem from '@/Components/AdminComponents/SubsTableItem'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { baseURL } from '@/config/api'

const Page = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [company, setCompany] = useState("");

  useEffect(() => {
    const storedCompany = localStorage.getItem("company");
    if (storedCompany) {
      setCompany(storedCompany);
    }
  }, []);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${baseURL}/api/admin/emails`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          company: company,
        },
      });
      if (response.data.success) {
        const filtered = response.data.emails.filter(e => e.company === company);
        setEmails(filtered);
      } else {
        toast.error('Failed to load subscriptions');
      }
    } catch (error) {
      toast.error('Failed to load subscriptions');
      console.error('Fetch emails error:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteEmail = async (mongoId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${baseURL}/api/admin/emails`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          id: mongoId,
        },
      });

      if (response.data.success) {
        toast.success(response.data.msg);
        fetchEmails();
      } else {
        toast.error('Error deleting email');
      }
    } catch (error) {
      toast.error('Server error');
      console.error('Delete email error:', error);
    }
  };

  useEffect(() => {
    if (company) {
      fetchEmails();
    }
  }, [company]);

  // Filter emails based on search
  const filteredEmails = emails.filter(email => 
    email.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSubscribers = emails.length;
  const recentSubscribers = emails.filter(email => {
    const emailDate = new Date(email.date);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return emailDate >= thirtyDaysAgo;
  }).length;

  return (
    <div className='flex-1 p-4 md:p-8 bg-gradient-to-br from-teal-50 to-emerald-50 min-h-screen'>
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Subscription Management</h1>
              <p className="text-gray-600 text-lg">Manage your newsletter subscribers</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200">
                <span className="text-sm text-gray-500">Total: </span>
                <span className="font-bold text-[#00D7A4]">{totalSubscribers}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-[#00D7A4] mb-1">{totalSubscribers}</p>
                <p className="text-gray-600 font-medium">Total Subscribers</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-[#00D7A4] to-teal-600 rounded-xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-blue-600 mb-1">{recentSubscribers}</p>
                <p className="text-gray-600 font-medium">Recent (30 days)</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search subscribers by email or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#00D7A4] focus:ring-4 focus:ring-teal-100 transition-all duration-200"
            />
          </div>
        </div>

        {/* Subscribers Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00D7A4]"></div>
              <span className="ml-4 text-gray-600 text-lg">Loading subscribers...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">Date Subscribed</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">Company</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredEmails.length > 0 ? (
                    filteredEmails.map((item) => (
                      <SubsTableItem
                        key={item._id}
                        mongoId={item._id}
                        deleteEmail={deleteEmail}
                        email={item.email}
                        date={item.date}
                        company={item.company}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center">
                          <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No subscribers found</h3>
                          <p className="text-gray-500">
                            {searchTerm 
                              ? 'Try adjusting your search criteria.' 
                              : 'No subscribers have signed up yet.'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Results Summary */}
        {filteredEmails.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Showing <span className="font-semibold text-[#00D7A4]">{filteredEmails.length}</span> of{' '}
              <span className="font-semibold text-[#00D7A4]">{totalSubscribers}</span> subscribers
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
