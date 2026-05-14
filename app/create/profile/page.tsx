'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Camera, Loader2, CheckCircle, AlertCircle, ChevronLeft, User, Upload, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function StepProfile() {
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [existingProfile, setExistingProfile] = useState<any>(null)
  const [mounted, setMounted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    loadExistingProfile()
  }, [])

  const loadExistingProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, bio, avatar_url')
        .eq('id', user.id)
        .single()

      if (data && !error) {
        setExistingProfile(data)
        if (data.full_name) setName(data.full_name)
        if (data.bio) setBio(data.bio)
        if (data.avatar_url) setAvatarUrl(data.avatar_url)
      }
    } catch (err) {
      console.error('Error loading profile:', err)
    }
  }

  const uploadAvatar = async (file: File) => {
    try {
      setUploading(true)
      setError('')

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not found')

      // Validasi file
      if (!file.type.startsWith('image/')) {
        throw new Error('File harus berupa gambar')
      }

      const maxSize = 2 * 1024 * 1024 // 2MB
      if (file.size > maxSize) {
        throw new Error('Ukuran file maksimal 2MB')
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      // Upload ke Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // Update profile dengan avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id)

      if (updateError) throw updateError

      setAvatarUrl(publicUrl)
    } catch (err: any) {
      setError(err.message)
      console.error('Error uploading avatar:', err)
    } finally {
      setUploading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      uploadAvatar(file)
    }
  }

  const removeAvatar = async () => {
    try {
      setUploading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('id', user.id)

      if (updateError) throw updateError

      setAvatarUrl(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validasi nama
    if (!name.trim()) {
      setError('Nama lengkap harus diisi')
      setLoading(false)
      return
    }

    if (name.length < 3) {
      setError('Nama minimal 3 karakter')
      setLoading(false)
      return
    }

    if (name.length > 100) {
      setError('Nama maksimal 100 karakter')
      setLoading(false)
      return
    }

    // Validasi bio
    if (bio && bio.length > 500) {
      setError('Bio maksimal 500 karakter')
      setLoading(false)
      return
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('Session expired. Silakan login kembali.')
        router.push('/login')
        return
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          full_name: name.trim(), 
          bio: bio.trim() || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (updateError) throw updateError

      setSuccess(true)
      
      setTimeout(() => {
        router.push('/create/links')
      }, 1500)
      
    } catch (err: any) {
      setError('Terjadi kesalahan. Silakan coba lagi.')
      setLoading(false)
    }
  }

  if (!mounted) return null

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl border border-gray-100">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-900">Profil Tersimpan!</h2>
          <p className="text-gray-600 mb-6">
            Profil Anda telah berhasil disimpan.
            <br />
            Mengalihkan ke halaman link...
          </p>
          <div className="animate-pulse">
            <Loader2 className="animate-spin mx-auto text-blue-600" size={24} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-100/40 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-indigo-100/30 blur-[100px] rounded-full -z-10" />

      <div className="w-full max-w-lg">
        {/* Back Button */}
        <Link 
          href="/create" 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-all mb-8 text-sm font-medium group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          Kembali ke Username
        </Link>

        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 relative overflow-hidden">
          {/* Decorative line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500" />

          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">
              Lengkapi Profilmu
            </h1>
            <p className="text-gray-500 text-sm">
              Informasi ini akan ditampilkan di halaman link bio kamu
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Avatar Upload Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-28 h-28 rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 border-4 border-white shadow-lg">
                {avatarUrl ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={avatarUrl}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera size={24} className="text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 group-hover:text-blue-500 transition-colors">
                    <User size={32} />
                    <span className="text-[10px] mt-1 font-medium">Upload</span>
                  </div>
                )}
              </div>
              {uploading && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <Loader2 className="animate-spin text-white" size={24} />
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="flex gap-2 mt-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                {avatarUrl ? 'Ganti Foto' : 'Upload Foto'}
              </button>
              {avatarUrl && (
                <>
                  <span className="text-gray-300">•</span>
                  <button
                    type="button"
                    onClick={removeAvatar}
                    className="text-xs text-red-500 hover:text-red-600 font-medium"
                  >
                    Hapus
                  </button>
                </>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Format: JPG, PNG, GIF (Max 2MB)
            </p>
          </div>

          <form onSubmit={handleNext} className="space-y-5">
            {/* Full Name Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                placeholder="Contoh: Ahmad Rizki" 
                className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all text-gray-900 placeholder:text-gray-400"
                value={name}
                onChange={(e) => setName(e.target.value)} 
                required 
              />
              <p className="text-xs text-gray-400 mt-1">
                Nama yang akan ditampilkan di halaman profil kamu
              </p>
            </div>

            {/* Bio Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Bio
              </label>
              <textarea 
                placeholder="Tuliskan deskripsi singkat tentang dirimu..." 
                className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all text-gray-900 placeholder:text-gray-400 resize-none"
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-400">
                  Ceritakan tentang dirimu (maksimal 500 karakter)
                </p>
                <p className="text-xs text-gray-400">
                  {bio.length}/500
                </p>
              </div>
            </div>

            {/* Preview Section */}
            {(name || bio || avatarUrl) && (
              <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">
                  Preview Profil
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden flex-shrink-0">
                    {avatarUrl ? (
                      <div className="relative w-full h-full">
                        <Image src={avatarUrl} alt="Preview" fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User size={20} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{name || 'Nama Kamu'}</p>
                    <p className="text-xs text-gray-500 line-clamp-2">{bio || 'Bio akan ditampilkan di sini...'}</p>
                  </div>
                </div>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white p-4 rounded-xl font-semibold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Menyimpan...
                </>
              ) : existingProfile?.full_name ? (
                <>
                  Simpan Perubahan
                  <CheckCircle size={16} />
                </>
              ) : (
                <>
                  Lanjut ke Link
                  <Upload size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-center text-xs text-gray-500">
              Informasi ini bisa diubah nanti di pengaturan akun
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-[10px] text-gray-400 uppercase tracking-wider font-medium">
          Step 2 of 3 • Setup Profile
        </p>
      </div>
    </div>
  )
}