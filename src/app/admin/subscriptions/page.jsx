'use client'

import SubsTableItem from '@/Components/AdminComponents/SubsTableItem'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { company  } from '@/config/api'

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

const Page = () => {
  const [emails, setEmails] = useState([]);
  const [company, setCompany] = useState("");


  useEffect(() => {
    const storedCompany = localStorage.getItem("company");
    if (storedCompany) {
      setCompany(storedCompany);
    }
  }, []);

  const fetchEmails = async () => {
    try {
      const token = localStorage.getItem('token');
      // Send company as query param
      const response = await axios.get(`${baseURL}/api/admin/emails`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          company: company,
        },
      });
      if (response.data.success) {
        // Filter emails by company in frontend as fallback
        const filtered = response.data.emails.filter(e => e.company === company);
        setEmails(filtered);
      } else {
        toast.error('Failed to load subscriptions');
      }
    } catch (error) {
      toast.error('Failed to load subscriptions');
      console.error('Fetch emails error:', error);
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

  return (
    <div className="flex-1 px-4 sm:px-10 pt-6 sm:pt-12 bg-blue-50/40 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Subscriber List</h1>

      <div className="relative max-w-4xl overflow-x-auto bg-white border border-gray-200 shadow rounded-xl scrollbar-hide">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs uppercase bg-gray-100 text-gray-500 rounded-t-xl">
            <tr>
              <th scope="col" className="px-5 py-4 w-1/3">Email</th>
              <th scope="col" className="px-5 py-4 hidden sm:table-cell w-1/4">Date Subscribed</th>
              <th scope="col" className="px-5 py-4 hidden sm:table-cell w-1/4">Company</th>
              <th scope="col" className="px-5 py-4 w-1/6">Action</th>
            </tr>
          </thead>
          <tbody>
            {emails.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center text-gray-400 py-10">
                  No subscriptions found
                </td>
              </tr>
            ) : (
              emails.map((item) => (
                <SubsTableItem
                  key={item._id}
                  mongoId={item._id}
                  deleteEmail={deleteEmail}
                  email={item.email}
                  date={item.date}
                  company={item.company}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
