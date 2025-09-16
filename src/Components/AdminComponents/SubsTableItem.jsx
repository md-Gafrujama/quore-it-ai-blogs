"use client";
import React from 'react'
import { TrashIcon, UserIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

const SubsTableItem = ({email, mongoId, deleteEmail, date, company}) => {
    
    const emailDate = new Date(date);
    
    return (
        <tr className='bg-white hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100'>
            <td className='px-6 py-4'>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#00D7A4] to-teal-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        <UserIcon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 truncate" title={email}>
                            {email ? email : "No Email"}
                        </p>
                        <p className="text-sm text-gray-500">Subscriber</p>
                    </div>
                </div>
            </td>
            <td className='px-6 py-4 hidden md:table-cell'>
                <div className="text-sm">
                    <p className="text-gray-900 font-medium">
                        {emailDate && !isNaN(emailDate) ? emailDate.toLocaleDateString() : 'No date'}
                    </p>
                    <p className="text-gray-500">
                        {emailDate && !isNaN(emailDate) ? emailDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                    </p>
                </div>
            </td>
            <td className='px-6 py-4 hidden sm:table-cell'>
                <div className="flex items-center gap-2">
                    <BuildingOfficeIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900 font-medium">
                        {company || 'No Company'}
                    </span>
                </div>
            </td>
            <td className='px-6 py-4'>
                <button
                    onClick={() => deleteEmail(mongoId)}
                    className="inline-flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                    title="Delete subscriber"
                >
                    <TrashIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">Delete</span>
                </button>
            </td>
        </tr>
    )
}

export default SubsTableItem
