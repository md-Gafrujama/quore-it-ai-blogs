"use client";
import React, { useEffect, useState } from 'react'
import { assets, dashboard_data } from '@/Assets/assets'
import { useAppContext } from '@/context/AppContext'
import toast from 'react-hot-toast'
const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000';

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState({
        blogs: 0,
        comments: 0,
        drafts: 0,
        recentBlogs: [],
        companyBlogCounts: {}
    })

    const [companySorting, setCompanySorting] = useState('alphabetical')
    const [approvedCompanies, setApprovedCompanies] = useState([])
    const [selectedCompany, setSelectedCompany] = useState('')
    const { axios } = useAppContext()

    const fetchDashboard = async () => {
        try {
            const { data } = await axios.get(`${baseURL}/api/admin/dashboard`)
            data.success ? setDashboardData(data.dashboardData) : toast.error(data.message)
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Fetch approved companies
    const fetchApprovedCompanies = async () => {
        try {
            const res = await axios.get(`${baseURL}/api/super-admin/getRequests`)
            const data = res.data
            if (Array.isArray(data)) {
                setApprovedCompanies(data.filter(c => c.status === "approved"))
            } else if (Array.isArray(data.data)) {
                setApprovedCompanies(data.data.filter(c => c.status === "approved"))
            } else {
                setApprovedCompanies([])
            }
        } catch (error) {
            setApprovedCompanies([])
        }
    }

    const handleCompanyChange = (e) => {
        setSelectedCompany(e.target.value)
    }

    // Get company count from companyBlogCounts object
    const getCompanyCount = () => {
        return Object.keys(dashboardData.companyBlogCounts || {}).length
    }

    // Get blog count for selected company
    const getSelectedCompanyBlogCount = () => {
        if (!selectedCompany) return '';
        return dashboardData.companyBlogCounts[selectedCompany] || 0;
    }

    useEffect(() => {
        fetchDashboard()
        fetchApprovedCompanies()
    }, [])

    return (
        <div className='flex-1 p-4 md:p-10 bg-blue-50/50'>
            <div className='flex flex-wrap gap-4'>
                {/* First Card - Total Companies */}
                <div className='flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all'>
                    <img src={assets.dashboard_icon_1} alt="" />
                    <div>
                        <p className='text-xl font-semibold text-gray-600'>{approvedCompanies.length}</p>
                        <p className='text-gray-400 font-light'>Total Approved Companies</p>
                    </div>
                </div>

                {/* Second Card - Blog Count */}
                <div className='flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all'>
                    <img src={assets.dashboard_icon_2} alt="" />
                    <div>
                        <p className='text-xl font-semibold text-gray-600'>
                            {selectedCompany ? getSelectedCompanyBlogCount() : dashboardData.comments}
                        </p>
                        <p className='text-gray-400 font-light'>
                            {selectedCompany ? `Blogs for ${selectedCompany}` : 'Blogs Count'}
                        </p>
                    </div>
                </div>

                {/* Third Card - Company Sorting */}
                <div className='bg-white p-4 min-w-58 rounded shadow hover:shadow-lg transition-all'>
                    <div className='flex items-center gap-3 mb-3'>
                        <div>
                            <p className='text-xl font-semibold text-gray-600'>{approvedCompanies.length}</p>
                            <p className='text-gray-400 font-light'>Active Companies</p>
                        </div>
                    </div>
                    
                    {/* Approved Companies Dropdown */}
                    <div className='mt-6'>
                        <label htmlFor="approved-companies" className='block text-sm font-medium text-gray-600 mb-2'>
                            Approved Companies:
                        </label>
                        <select
                            id="approved-companies"
                            className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white'
                            value={selectedCompany}
                            onChange={handleCompanyChange}
                        >
                            <option value="">Select a company</option>
                            {approvedCompanies.map(company => (
                                <option key={company._id} value={company.company}>
                                    {company.company}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
