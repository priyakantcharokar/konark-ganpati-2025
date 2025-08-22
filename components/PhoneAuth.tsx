'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Lock, CheckCircle, ArrowLeft, AlertCircle } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface PhoneAuthProps {
  flatNumber: string
  onAuthSuccess: (phone: string) => void
}

const PhoneAuth: React.FC<PhoneAuthProps> = ({ flatNumber, onAuthSuccess }) => {
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [verified, setVerified] = useState(false)

  // Check if Supabase is configured
  if (!isSupabaseConfigured()) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Setup Required
          </h2>
          <p className="text-gray-600">
            Supabase configuration is needed to enable authentication
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-3xl p-8 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-yellow-600" />
          </div>
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">
            Supabase Not Configured
          </h3>
          <p className="text-yellow-700 mb-4">
            To enable phone authentication, you need to set up Supabase first.
          </p>
          <div className="space-y-3 text-sm text-yellow-700">
            <p>1. Follow <strong>SUPABASE_SETUP.md</strong></p>
            <p>2. Create <strong>.env.local</strong> file</p>
            <p>3. Add your Supabase credentials</p>
          </div>
          <div className="mt-6 p-4 bg-white rounded-xl border border-yellow-200">
            <p className="text-xs text-gray-600 font-mono">
              NEXT_PUBLIC_SUPABASE_URL=your-url<br/>
              NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
            </p>
          </div>
        </div>
      </motion.div>
    )
  }

  const handleSendOTP = async () => {
    if (!phone || phone.length < 10) {
      toast.error('Please enter a valid phone number')
      return
    }

    setLoading(true)
    try {
      // Format phone number for international format
      const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`
      
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
        options: {
          data: {
            flat_number: flatNumber
          }
        }
      })

      if (error) {
        throw error
      }
      
      setOtpSent(true)
      toast.success('OTP sent successfully! Check your phone.')
      
    } catch (error: any) {
      console.error('Error sending OTP:', error)
      toast.error(error.message || 'Failed to send OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP')
      return
    }

    setLoading(true)
    try {
      // Format phone number for international format
      const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`
      
      const { error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp,
        type: 'sms'
      })

      if (error) {
        throw error
      }

      // Get the current user session
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Store additional user data in our users table
        await storeUserData(user.id, formattedPhone)
        
        setVerified(true)
        toast.success('Phone number verified successfully!')
        
        setTimeout(() => {
          onAuthSuccess(formattedPhone)
        }, 1000)
      } else {
        throw new Error('User not found after verification')
      }
      
    } catch (error: any) {
      console.error('Error verifying OTP:', error)
      toast.error(error.message || 'Verification failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const storeUserData = async (userId: string, phoneNumber: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .upsert({
          id: userId,
          phone: phoneNumber,
          flat_number: flatNumber,
        }, {
          onConflict: 'id'
        })

      if (error) {
        console.error('Error storing user data:', error)
        // Don't throw error here as user is already authenticated
      }
    } catch (error) {
      console.error('Error storing user data:', error)
    }
  }

  const resetForm = () => {
    setPhone('')
    setOtp('')
    setOtpSent(false)
    setVerified(false)
  }

  const goBack = () => {
    resetForm()
    // This will trigger the parent to go back to flat selection
    window.location.reload()
  }

  if (verified) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-8"
      >
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Phone Verified Successfully!
        </h3>
        <p className="text-gray-600">
          Welcome to Ganesh Pooja 2025! Redirecting...
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Phone Verification
        </h2>
        <p className="text-gray-600">
          Flat {flatNumber} • Enter your phone number to continue
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-8">
        {!otpSent ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter your phone number"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  maxLength={10}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Enter 10-digit mobile number (e.g., 9876543210)
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={goBack}
                className="btn-secondary flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>
              <button
                onClick={handleSendOTP}
                disabled={loading || !phone || phone.length < 10}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter OTP
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit OTP"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-center text-lg font-mono"
                  maxLength={6}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                OTP sent to {phone.startsWith('+') ? phone : `+91${phone}`}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={resetForm}
                className="btn-secondary flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>
              <button
                onClick={handleVerifyOTP}
                disabled={loading || !otp || otp.length !== 6}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </div>

            <div className="text-center">
              <button
                onClick={handleSendOTP}
                disabled={loading}
                className="text-sm text-primary-600 hover:text-primary-700 underline disabled:opacity-50"
              >
                Didn't receive OTP? Resend
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-blue-600 text-xs">ℹ</span>
          </div>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">How it works:</p>
            <ul className="space-y-1 text-blue-700">
              <li>• Enter your 10-digit mobile number</li>
              <li>• Receive OTP via SMS</li>
              <li>• Verify OTP to access festival schedule</li>
              <li>• Your data is securely stored</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default PhoneAuth
