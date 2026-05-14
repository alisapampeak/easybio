'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Loader2, CheckCircle, AlertCircle, ChevronLeft, GripVertical, Link as LinkIcon, Globe, Mail } from 'lucide-react'
import Link from 'next/link'

interface LinkItem {
  id: string
  title: string
  url: string
  icon_type: string
  order: number
}

const iconOptions = [
  { value: 'link', label: 'Link', icon: LinkIcon },
  { value: 'globe', label: 'Website', icon: Globe },
  { value: 'email', label: 'Email', icon: Mail },
]

export default function StepLinks() {
  const [links, setLinks] = useState<LinkItem[]>([
    { id: '1', title: '', url: '', icon_type: 'link', order: 0 }
  ])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [existingLinks, setExistingLinks] = useState<LinkItem[]>([])
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    loadExistingLinks()
  }, [])

  const loadExistingLinks = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', user.id)
        .order('order', { ascending: true })

      if (error) throw error

      if (data && data.length > 0) {
        setExistingLinks(data)
        setLinks(data)
      }
    } catch (err) {
      console.error('Error loading links:', err)
    }
  }

  const addLink = () => {
    const newId = Date.now().toString()
    setLinks([
      ...links,
      { 
        id: newId, 
        title: '', 
        url: '', 
        icon_type: 'link', 
        order: links.length 
      }
    ])
  }

  const removeLink = (id: string) => {
    if (links.length === 1) {
      setError('Minimal harus memiliki 1 link')
      return
    }
    setLinks(links.filter(link => link.id !== id))
  }

  const updateLink = (id: string, field: keyof LinkItem, value: string) => {
    setLinks(links.map(link => 
      link.id === id ? { ...link, [field]: value } : link
    ))
  }

  const validateUrls = () => {
    for (const link of links) {
      if (!link.title.trim()) {
        setError(`Judul link tidak boleh kosong`)
        return false
      }
      if (!link.url.trim()) {
        setError(`URL link tidak boleh kosong`)
        return false
      }
      try {
        new URL(link.url)
      } catch {
        setError(`URL "${link.title}" tidak valid. Gunakan format https://...`)
        return false
      }
    }
    return true
  }

  const saveLinks = async () => {
    if (!validateUrls()) return

    setSaving(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('Session expired. Silakan login kembali.')
        router.push('/login')
        return
      }

      // Delete existing links
      const { error: deleteError } = await supabase
        .from('links')
        .delete()
        .eq('user_id', user.id)

      if (deleteError) throw deleteError

      // Insert new links
      const linksToInsert = links.map((link, index) => ({
        user_id: user.id,
        title: link.title.trim(),
        url: link.url.trim(),
        icon_type: link.icon_type,
        order: index,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }))

      const { error: insertError } = await supabase
        .from('links')
        .insert(linksToInsert)

      if (insertError) throw insertError

      setSuccess(true)
      
      setTimeout(() => {
        router.push('/create/theme')
      }, 1500)
      
    } catch (err: any) {
      console.error('Error saving links:', err)
      setError('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setSaving(false)
    }
  }

  const handleSkip = () => {
    router.push('/create/theme')
  }

  if (!mounted) return null

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl border border-gray-100">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-900">Link Tersimpan!</h2>
          <p className="text-gray-600 mb-6">
            {links.length} link telah berhasil disimpan.
            <br />
            Mengalihkan ke halaman tema...
          </p>
          <div className="animate-pulse">
            <Loader2 className="animate-spin mx-auto text-blue-600" size={24} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8 px-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-100/40 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-indigo-100/30 blur-[100px] rounded-full -z-10" />

      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <Link 
          href="/create/profile" 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-all mb-6 text-sm font-medium group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          Kembali ke Profil
        </Link>

        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100 relative overflow-hidden">
          {/* Decorative line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500" />

          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              <LinkIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">
              Tambahkan Link
            </h1>
            <p className="text-gray-500 text-sm">
              Tambahkan semua link pentingmu. Kamu bisa mengaturnya nanti di dashboard.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Stats */}
          <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Link</span>
              <span className="text-2xl font-bold text-gray-900">{links.length}</span>
            </div>
          </div>

          {/* Links List */}
          <div className="space-y-4 mb-6 max-h-[500px] overflow-y-auto pr-2">
            {links.map((link, index) => (
              <div key={link.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-gray-200 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <GripVertical size={16} className="text-gray-400 cursor-move" />
                    <span className="text-xs font-medium text-gray-500">Link {index + 1}</span>
                  </div>
                  <button
                    onClick={() => removeLink(link.id)}
                    className="p-1 hover:bg-red-100 rounded-lg transition-colors group"
                  >
                    <Trash2 size={16} className="text-gray-400 group-hover:text-red-500 transition-colors" />
                  </button>
                </div>
                
                <div className="space-y-3">
                  {/* Icon Type Select */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Ikon
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {iconOptions.map((icon) => {
                        const IconComponent = icon.icon
                        return (
                          <button
                            key={icon.value}
                            type="button"
                            onClick={() => updateLink(link.id, 'icon_type', icon.value)}
                            className={`p-2 rounded-lg flex flex-col items-center gap-1 transition-all ${
                              link.icon_type === icon.value
                                ? 'bg-blue-100 border-2 border-blue-500 text-blue-600'
                                : 'bg-white border border-gray-200 text-gray-500 hover:border-blue-300'
                            }`}
                          >
                            <IconComponent size={16} />
                            <span className="text-[10px]">{icon.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Title Input */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Judul Link
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Portfolio Saya"
                      className="w-full bg-white border border-gray-200 p-3 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-gray-900 placeholder:text-gray-400 text-sm"
                      value={link.title}
                      onChange={(e) => updateLink(link.id, 'title', e.target.value)}
                    />
                  </div>

                  {/* URL Input */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      URL Link
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com"
                      className="w-full bg-white border border-gray-200 p-3 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-gray-900 placeholder:text-gray-400 text-sm"
                      value={link.url}
                      onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Link Button */}
          <button
            onClick={addLink}
            className="w-full mb-6 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-all flex items-center justify-center gap-2 font-medium"
          >
            <Plus size={18} />
            Tambah Link Baru
          </button>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={saveLinks}
              disabled={saving}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white p-4 rounded-xl font-semibold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Menyimpan {links.length} Link...
                </>
              ) : existingLinks.length > 0 ? (
                <>
                  Perbarui Link
                  <CheckCircle size={16} />
                </>
              ) : (
                <>
                  Simpan & Lanjutkan
                  <CheckCircle size={16} />
                </>
              )}
            </button>
            
            <button
              onClick={handleSkip}
              className="w-full text-gray-500 font-medium text-sm py-3 hover:text-gray-700 transition-colors"
            >
              Lewati Dulu (Isi Nanti)
            </button>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-8 flex justify-center items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gray-300" />
          <div className="w-2 h-2 rounded-full bg-gray-300" />
          <div className="w-2 h-2 rounded-full bg-blue-600" />
          <div className="w-2 h-2 rounded-full bg-gray-300" />
        </div>
        <p className="text-center text-[10px] text-gray-400 uppercase tracking-wider font-medium mt-2">
          Step 3 of 4 • Setup Links
        </p>
      </div>
    </div>
  )
}