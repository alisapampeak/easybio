'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Instagram, Twitter, Github, Linkedin, Youtube, Mail, Plus, Trash2, Edit2, Save, X } from 'lucide-react'

interface SocialAccount {
  id: string
  platform: string
  username: string
  url: string
}

const platforms = [
  { value: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-600' },
  { value: 'twitter', label: 'Twitter', icon: Twitter, color: 'text-blue-400' },
  { value: 'github', label: 'GitHub', icon: Github, color: 'text-gray-700' },
  { value: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' },
  { value: 'youtube', label: 'YouTube', icon: Youtube, color: 'text-red-600' },
  { value: 'email', label: 'Email', icon: Mail, color: 'text-gray-500' },
]

export default function SocialPage() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ platform: '', username: '', url: '' })
  const [newAccount, setNewAccount] = useState({ platform: 'instagram', username: '', url: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadSocialAccounts()
  }, [])

  const loadSocialAccounts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('social_accounts')
        .select('*')
        .eq('user_id', user.id)
      
      setAccounts(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const addAccount = async () => {
    if (!newAccount.username || !newAccount.url) {
      alert('Please fill in all fields')
      return
    }

    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('social_accounts')
        .insert({
          user_id: user.id,
          platform: newAccount.platform,
          username: newAccount.username,
          url: newAccount.url
        })

      if (error) throw error

      setNewAccount({ platform: 'instagram', username: '', url: '' })
      await loadSocialAccounts()
    } catch (error) {
      alert('Failed to add social account')
    } finally {
      setSaving(false)
    }
  }

  const updateAccount = async (id: string) => {
    if (!editForm.username || !editForm.url) {
      alert('Please fill in all fields')
      return
    }

    setSaving(true)
    try {
      const { error } = await supabase
        .from('social_accounts')
        .update({ username: editForm.username, url: editForm.url })
        .eq('id', id)

      if (error) throw error

      setEditingId(null)
      await loadSocialAccounts()
    } catch (error) {
      alert('Failed to update account')
    } finally {
      setSaving(false)
    }
  }

  const deleteAccount = async (id: string) => {
    if (!confirm('Are you sure you want to remove this social account?')) return

    try {
      const { error } = await supabase
        .from('social_accounts')
        .delete()
        .eq('id', id)

      if (error) throw error
      await loadSocialAccounts()
    } catch (error) {
      alert('Failed to delete account')
    }
  }

  const getPlatformIcon = (platform: string) => {
    const found = platforms.find(p => p.value === platform)
    if (found) {
      const Icon = found.icon
      return <Icon size={24} className={found.color} />
    }
    return null
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Social Media</h1>
        <p className="text-gray-500 text-sm mt-1">Connect your social media accounts</p>
      </div>

      {/* Add New Account Form */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8">
        <h2 className="font-semibold text-gray-900 mb-4">Add Social Account</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <select
            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
            value={newAccount.platform}
            onChange={(e) => setNewAccount({ ...newAccount, platform: e.target.value })}
          >
            {platforms.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Username (e.g., johndoe)"
            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
            value={newAccount.username}
            onChange={(e) => setNewAccount({ ...newAccount, username: e.target.value })}
          />
          <input
            type="url"
            placeholder="Profile URL"
            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
            value={newAccount.url}
            onChange={(e) => setNewAccount({ ...newAccount, url: e.target.value })}
          />
        </div>
        <button
          onClick={addAccount}
          disabled={saving}
          className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-all disabled:opacity-50"
        >
          <Plus size={18} />
          Add Account
        </button>
      </div>

      {/* Social Accounts List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Connected Accounts ({accounts.length})</h2>
        </div>
        
        {accounts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No social accounts connected yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {accounts.map((account) => {
              const platformInfo = platforms.find(p => p.value === account.platform)
              return (
                <div key={account.id} className="p-6 hover:bg-gray-50 transition-all">
                  {editingId === account.id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editForm.username}
                        onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="Username"
                      />
                      <input
                        type="url"
                        value={editForm.url}
                        onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="URL"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateAccount(account.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-500"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                          {getPlatformIcon(account.platform)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{platformInfo?.label || account.platform}</h3>
                          <p className="text-sm text-gray-500">@{account.username}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingId(account.id)
                            setEditForm({ platform: account.platform, username: account.username, url: account.url })
                          }}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => deleteAccount(account.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}