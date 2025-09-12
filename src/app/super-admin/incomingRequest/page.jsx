'use client'

import React, { useEffect, useState } from 'react'

const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000';

const SuperAdminPanel = () => {
  const [registrations, setRegistrations] = useState([])
  const [selectedRegistration, setSelectedRegistration] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)

  // Fetch registrations from API
  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${NEXT_PUBLIC_BASE_URL}/api/super-admin/getRequests`)
        const data = await res.json()
        setRegistrations(Array.isArray(data) ? data : data.data || data || [])
      } catch (err) {
        setRegistrations([])
      } finally {
        setLoading(false)
      }
    }
    fetchRegistrations()
  }, [])

  // Filter registrations based on status
  const filteredRegistrations = registrations.filter(reg => 
    filterStatus === 'all' || reg.status === filterStatus
  )

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleString()
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'approved': return 'bg-green-100 text-green-800 border-green-200'
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return '⏱️'
      case 'approved': return '✅'
      case 'rejected': return '❌'
      default: return '📋'
    }
  }

  const handleStatusChange = async (registrationId, newStatus, rejectionReason = '') => {
    setIsProcessing(true)
    try {
      const res = await fetch(
        `${NEXT_PUBLIC_BASE_URL}/api/super-admin/approveRequest/${registrationId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus, rejectionReason }),
        }
      )
      const data = await res.json()
      if (data.success) {
        // Optionally, refetch registrations from server for up-to-date data
        const refreshed = await fetch(`${NEXT_PUBLIC_BASE_URL}/api/super-admin/getRequests`)
        const refreshedData = await refreshed.json()
        setRegistrations(Array.isArray(refreshedData) ? refreshedData : refreshedData.data || refreshedData || [])
        setShowModal(false)
        setSelectedRegistration(null)
        alert(`Registration ${newStatus} successfully!`)
      } else {
        alert(data.message || 'Failed to update status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Error updating registration status. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const openRegistrationModal = (registration) => {
    setSelectedRegistration(registration)
    setShowModal(true)
  }

  const RegistrationModal = () => {
    const [rejectionReason, setRejectionReason] = useState('')
    const [actionType, setActionType] = useState('')

    if (!selectedRegistration) return null

    const handleAction = (action) => {
      setActionType(action)
      if (action === 'approve') {
        handleStatusChange(selectedRegistration._id || selectedRegistration.id, 'approved')
      } else if (action === 'reject') {
        if (!rejectionReason.trim()) {
          alert('Please provide a reason for rejection')
          return
        }
        handleStatusChange(selectedRegistration._id || selectedRegistration.id, 'rejected', rejectionReason)
      }
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b">
            <h2 className="text-2xl font-bold text-gray-900">Registration Review</h2>
            <button
              onClick={() => setShowModal(false)}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ✕
            </button>
          </div>

          {/* Registration Details */}
          <div className="space-y-6">
            {/* Status */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Current Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedRegistration.status)}`}>
                  {getStatusIcon(selectedRegistration.status)} {selectedRegistration.status ? selectedRegistration.status.charAt(0).toUpperCase() + selectedRegistration.status.slice(1) : '-'}
                </span>
              </div>
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="mr-2">👤</span>
                  Personal Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Name:</span> {selectedRegistration.fullname}</div>
                  <div><span className="font-medium">Email:</span> {selectedRegistration.email}</div>
                  {/* If you add phone in your model, show it here */}
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="mr-2">🏢</span>
                  Company Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Company:</span> {selectedRegistration.company}</div>
                  <div><span className="font-medium">Business Type:</span> {selectedRegistration.businessType}</div>
                  <div><span className="font-medium">Submitted:</span> {formatDate(selectedRegistration.createdAt)}</div>
                </div>
              </div>
            </div>

            {/* Action Section - Only show for pending registrations */}
            {selectedRegistration.status === 'pending' && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Take Action</h3>
                <div className="mb-4">
                  <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Rejection (required if rejecting):
                  </label>
                  <textarea
                    id="rejectionReason"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Please provide a detailed reason for rejection..."
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAction('approve')}
                    disabled={isProcessing}
                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
                  >
                    {isProcessing && actionType === 'approve' ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      <>
                        <span className="mr-2">✅</span>
                        Approve Registration
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleAction('reject')}
                    disabled={isProcessing}
                    className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
                  >
                    {isProcessing && actionType === 'reject' ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      <>
                        <span className="mr-2">❌</span>
                        Reject Registration
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Review Information (for approved/rejected) */}
            {selectedRegistration.status !== 'pending' && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Review Information</h3>
                <div className="text-sm text-gray-700 space-y-1">
                  <div><span className="font-medium">Reviewed At:</span> {formatDate(selectedRegistration.reviewedAt)}</div>
                  <div><span className="font-medium">Reviewed By:</span> {selectedRegistration.reviewedBy}</div>
                  {selectedRegistration.rejectionReason && (
                    <div className="mt-3 p-3 bg-red-50 rounded border border-red-200">
                      <span className="font-medium text-red-800">Rejection Reason:</span>
                      <p className="text-red-700 mt-1">{selectedRegistration.rejectionReason}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <div className="text-3xl text-white">👨‍💼</div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Super Admin Panel</h1>
          <p className="text-lg text-gray-600">
            Manage Company Registration Requests
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="text-2xl mr-3">📋</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{registrations.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-yellow-200 bg-yellow-50">
            <div className="flex items-center">
              <div className="text-2xl mr-3">⏱️</div>
              <div>
                <p className="text-sm font-medium text-yellow-800">Pending</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {registrations.filter(r => r.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-green-200 bg-green-50">
            <div className="flex items-center">
              <div className="text-2xl mr-3">✅</div>
              <div>
                <p className="text-sm font-medium text-green-800">Approved</p>
                <p className="text-2xl font-bold text-green-900">
                  {registrations.filter(r => r.status === 'approved').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-red-200 bg-red-50">
            <div className="flex items-center">
              <div className="text-2xl mr-3">❌</div>
              <div>
                <p className="text-sm font-medium text-red-800">Rejected</p>
                <p className="text-2xl font-bold text-red-900">
                  {registrations.filter(r => r.status === 'rejected').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <label htmlFor="filter" className="text-sm font-medium text-gray-700">
              Filter by Status:
            </label>
            <select
              id="filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="all">All Registrations</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Registrations List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-lg text-gray-500">Loading...</div>
          ) : filteredRegistrations.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-4xl mb-4">📭</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No registrations found</h3>
              <p className="text-gray-600">No registrations match the current filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Business Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRegistrations.map((registration) => (
                    <tr key={registration._id || registration.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {registration.company}
                          </div>
                          <div className="text-sm text-gray-500">
                            {registration.fullname}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{registration.email}</div>
                        {/* <div className="text-sm text-gray-500">{registration.phone || '-'}</div> */}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {registration.businessType || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(registration.status)}`}>
                          {getStatusIcon(registration.status)} {registration.status ? registration.status.charAt(0).toUpperCase() + registration.status.slice(1) : '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(registration.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => openRegistrationModal(registration)}
                          className="text-blue-600 hover:text-blue-900 hover:underline"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Registration Modal */}
      {showModal && <RegistrationModal />}
    </div>
  )
}

export default SuperAdminPanel