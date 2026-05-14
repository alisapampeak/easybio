'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Trash2, Edit2, Save, X, GripVertical, Globe, Link as LinkIcon } from 'lucide-react'

interface Link {
  id: string
  title: string
  url: string
  icon_type: string
  order: number
  clicks: number
}

export default function LinksPage() {
  const [links, setLinks] = useState<Link[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ title: '', url: '' })
  const [newLink, setNewLink] = useState({ title: '', url: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadLinks()
  }, [])

  const loadLinks = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', user.id)
        .order('order', { ascending: true })
      
      setLinks(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const addLink = async () => {
    if (!newLink.title || !newLink.url) {
      alert('Please fill in both title and URL')
      return
    }

    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('links')
        .insert({
          user_id: user.id,
          title: newLink.title,
          url: newLink.url,
          icon_type: 'link',
          order: links.length
        })

      if (error) throw error

      setNewLink({ title: '', url: '' })
      await loadLinks()
    } catch (error) {
      alert('Failed to add link')
    } finally {
      setSaving(false)
    }
  }

  const updateLink = async (id: string) => {
    if (!editForm.title || !editForm.url) {
      alert('Please fill in both title and URL')
      return
    }

    setSaving(true)
    try {
      const { error } = await supabase
        .from('links')
        .update({ title: editForm.title, url: editForm.url })
        .eq('id', id)

      if (error) throw error

      setEditingId(null)
      await loadLinks()
    } catch (error) {
      alert('Failed to update link')
    } finally {
      setSaving(false)
    }
  }

  const deleteLink = async (id: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return

    try {
      const { error } = await supabase
        .from('links')
        .delete()
        .eq('id', id)

      if (error) throw error
      await loadLinks()
    } catch (error) {
      alert('Failed to delete link')
    }
  }

  const startEdit = (link: Link) => {
    setEditingId(link.id)
    setEditForm({ title: link.title, url: link.url })
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Manage Links</h1>
        <p className="text-gray-500 text-sm mt-1">Add, edit, or remove your links</p>
      </div>

      {/* Add New Link Form */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8">
        <h2 className="font-semibold text-gray-900 mb-4">Add New Link</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Link Title (e.g., My Portfolio)"
            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
            value={newLink.title}
            onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
          />
          <input
            type="url"
            placeholder="URL (e.g., https://example.com)"
            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
            value={newLink.url}
            onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
          />
        </div>
        <button
          onClick={addLink}
          disabled={saving}
          className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-all disabled:opacity-50"
        >
          <Plus size={18} />
          Add Link
        </button>
      </div>

      {/* Links List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Your Links ({links.length})</h2>
        </div>
        
        {links.length === 0 ? (
          <div className="text-center py-12">
            <LinkIcon size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400">No links yet. Add your first link above!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {links.map((link) => (
              <div key={link.id} className="p-6 hover:bg-gray-50 transition-all">
                {editingId === link.id ? (
                  // Edit Mode
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Title"
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
                        onClick={() => updateLink(link.id)}
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
                  // View Mode
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                          <Globe size={18} className="text-gray-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{link.title}</h3>
                          <p className="text-sm text-gray-500 truncate max-w-md">{link.url}</p>
                          <p className="text-xs text-gray-400 mt-1">{link.clicks || 0} clicks</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(link)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => deleteLink(link.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}