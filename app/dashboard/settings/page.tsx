'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Key, Shield, Trash2, AlertTriangle, Loader2, CheckCircle } from 'lucide-react'

export default function SettingsPage() {
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const router = useRouter()

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordForm.new !== passwordForm.confirm) {
      setMessage({ type: 'error', text: 'New passwords do not match' })
      return
    }

    if (passwordForm.new.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' })
      return
    }

    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.new
      })

      if (error) throw error

      setMessage({ type: 'success', text: 'Password updated successfully!' })
      setPasswordForm({ current: '', new: '', confirm: '' })
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update password' })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE MY ACCOUNT') {
      setMessage({ type: 'error', text: 'Please type DELETE MY ACCOUNT to confirm' })
      return
    }

    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Delete profile (cascade will delete links, social accounts, etc.)
      const { error: deleteError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id)

      if (deleteError) throw deleteError

      // Sign out user
      await supabase.auth.signOut()
      
      // Redirect to home
      router.push('/')
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete account. Please try again.' })
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your account settings</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Change Password Section */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Key size={20} className="text-blue-600" />
            </div>
            <h2 className="font-semibold text-gray-900">Change Password</h2>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={passwordForm.new}
                onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                placeholder="Enter new password"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordForm.confirm}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                placeholder="Confirm new password"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-all disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* Two-Factor Authentication Section */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Shield size={20} className="text-purple-600" />
            </div>
            <h2 className="font-semibold text-gray-900">Two-Factor Authentication</h2>
          </div>
          <p className="text-gray-500 text-sm mb-4">
            Add an extra layer of security to your account
          </p>
          <button className="bg-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-purple-500 transition-all">
            Enable 2FA
          </button>
          <p className="text-xs text-gray-400 mt-3">
            Coming soon: Secure your account with Google Authenticator
          </p>
        </div>

        {/* Delete Account Section */}
        <div className="bg-white rounded-2xl p-6 border border-red-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <Trash2 size={20} className="text-red-600" />
            </div>
            <h2 className="font-semibold text-red-600">Delete Account</h2>
          </div>
          <p className="text-gray-500 text-sm mb-4">
            Once you delete your account, there is no going back. This action is permanent.
          </p>
          
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-red-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-700 transition-all"
            >
              Delete Account
            </button>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={18} className="text-red-600" />
                  <p className="font-semibold text-red-600">Warning: This action cannot be undone!</p>
                </div>
                <p className="text-sm text-gray-600">
                  All your links, social accounts, and profile data will be permanently deleted.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type <span className="font-bold text-red-600">DELETE MY ACCOUNT</span> to confirm
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500"
                  placeholder="DELETE MY ACCOUNT"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteAccount}
                  disabled={loading}
                  className="bg-red-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-700 transition-all disabled:opacity-50"
                >
                  {loading ? 'Deleting...' : 'Permanently Delete Account'}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false)
                    setDeleteConfirmText('')
                  }}
                  className="px-6 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`p-4 rounded-xl ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message.type === 'success' ? <CheckCircle size={18} className="inline mr-2" /> : <AlertTriangle size={18} className="inline mr-2" />}
            {message.text}
          </div>
        )}
      </div>
    </div>
  )
}