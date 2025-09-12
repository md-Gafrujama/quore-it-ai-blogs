'use client'

import React, { useState } from 'react'

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    company: '',
    email: '',
    businessType: ''
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [registrationStatus, setRegistrationStatus] = useState(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const businessTypes = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Retail',
    'Manufacturing',
    'Consulting',
    'Real Estate',
    'Other'
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.fullname.trim()) newErrors.fullname = 'Full name is required'
    if (!formData.company.trim()) newErrors.company = 'Company name is required'
    if (!formData.businessType) newErrors.businessType = 'Business type is required'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) newErrors.email = 'Email address is required'
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Please enter a valid email address'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsSubmitting(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blog/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      console.log("📌 API Response:", data) // Debugging

      if (res.ok && data.success) {
        setRegistrationStatus('pending')
        setShowSuccessModal(true)
        setFormData({
          fullname: '',
          company: '',
          email: '',
          businessType: ''
        })
      } else {
        setRegistrationStatus('rejected')
        setErrors({ api: data.message || 'Registration failed' })
      }
    } catch (error) {
      console.error("❌ API Error:", error)
      setErrors({ api: 'Something went wrong. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Success Modal Component
  const SuccessModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="text-2xl">⏰</div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Registration Submitted!</h3>
        <p className="text-gray-600 mb-6">
          Your company registration has been submitted successfully. A super admin will review your application and you'll receive an email notification about the approval status.
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center">
            <span className="text-xl mr-2">⏱️</span>
            <span className="text-sm font-medium text-yellow-800">Status: Pending Approval</span>
          </div>
        </div>
        <button
          onClick={() => setShowSuccessModal(false)}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Got it!
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <div className="text-3xl text-white">🏢</div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Company Registration</h1>
            <p className="text-lg text-gray-600">
              Join our platform and grow your business
            </p>
            {registrationStatus && (
              <div className="mt-4">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  <span className="mr-1">⏱️</span>
                  Pending Approval
                </div>
              </div>
            )}
          </div>

          {/* Main Form */}
          <div className="bg-white shadow-2xl rounded-3xl overflow-hidden">
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullname"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      errors.fullname ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.fullname && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <span className="mr-1">❌</span>
                      {errors.fullname}
                    </p>
                  )}
                </div>

                {/* Company Name */}
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      errors.company ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="Acme Corporation"
                  />
                  {errors.company && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <span className="mr-1">❌</span>
                      {errors.company}
                    </p>
                  )}
                </div>

                {/* Business Type */}
                <div>
                  <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-2">
                    Business Type *
                  </label>
                  <select
                    id="businessType"
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      errors.businessType ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <option value="">Select business type</option>
                    {businessTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.businessType && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <span className="mr-1">❌</span>
                      {errors.businessType}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="john@company.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <span className="mr-1">❌</span>
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* API Error */}
                {errors.api && (
                  <div className="text-red-600 text-sm mb-2 flex items-center">
                    <span className="mr-1">❌</span>
                    {errors.api}
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex justify-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-base font-semibold text-white transition-all transform hover:scale-105 ${
                      isSubmitting 
                        ? 'bg-gray-400 cursor-not-allowed scale-100' 
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    }`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Submitting Registration...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <span className="mr-2">✅</span>
                        Submit Registration
                      </div>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* Success Modal */}
      {showSuccessModal && <SuccessModal />}
    </div>
  )
}

export default RegistrationForm
