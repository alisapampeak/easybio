'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Loader2, CheckCircle, AlertCircle, ArrowRight, ChevronLeft, User } from 'lucide-react'
import Link from 'next/link'

export default function CreateUsername() {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [checking, setChecking] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Cek ketersediaan username (debounced)
  useEffect(() => {
    if (!username || username.length < 3) {
      setIsAvailable(null)
      return
    }

    const delayDebounce = setTimeout(async () => {
      setChecking(true)
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('username', username.toLowerCase())
          .single()

        if (error && error.code === 'PGRST116') {
          // Username tersedia
          setIsAvailable(true)
          setError('')
        } else if (data) {
          // Username sudah dipakai
          setIsAvailable(false)
          setError('Username sudah digunakan')
        }
      } catch (err) {
        console.error('Error checking username:', err)
      } finally {
        setChecking(false)
      }
    }, 500)

    return () => clearTimeout(delayDebounce)
  }, [username])

  const validateUsername = (value: string) => {
    if (value.length < 3) {
      return 'Username minimal 3 karakter'
    }
    if (value.length > 20) {
      return 'Username maksimal 20 karakter'
    }
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      return 'Username hanya boleh mengandung huruf, angka, dan underscore (_)'
    }
    return ''
  }

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validasi username
    const validationError = validateUsername(username)
    if (validationError) {
      setError(validationError)
      return
    }

    // Cek ketersediaan lagi sebelum submit
    if (!isAvailable) {
      setError('Username tidak tersedia. Silakan pilih username lain.')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        setError('Session expired. Silakan login kembali.')
        router.push('/login')
        return
      }

      // Cek apakah user sudah punya username
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single()

      if (existingProfile?.username) {
        // User sudah punya username, redirect ke profile page
        router.push('/create/profile')
        return
      }

      // Insert atau update profile
      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id, 
          username: username.toLowerCase().trim(),
          updated_at: new Date().toISOString()
        })

      if (upsertError) {
        if (upsertError.code === '23505') { // Unique violation
          setError('Username sudah diambil. Silakan pilih username lain.')
        } else {
          setError('Terjadi kesalahan. Silakan coba lagi.')
        }
        setLoading(false)
        return
      }

      // Sukses
      setSuccess(true)
      
      // Simpan username ke localStorage untuk sementara
      localStorage.setItem('tempUsername', username.toLowerCase())
      
      // Redirect setelah 1.5 detik
      setTimeout(() => {
        router.push('/create/profile')
      }, 1500)
      
    } catch (err) {
      console.error('Error:', err)
      setError('Terjadi kesalahan. Silakan coba lagi.')
      setLoading(false)
    }
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return null
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl border border-gray-100">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-900">Username Berhasil!</h2>
          <p className="text-gray-600 mb-6">
            Username @{username.toLowerCase()} telah disimpan.
            <br />
            Mengalihkan ke halaman berikutnya...
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
      {/* Background Glow Soft */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-100/40 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-indigo-100/30 blur-[100px] rounded-full -z-10" />

      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link 
          href="/register" 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-all mb-8 text-sm font-medium group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          Kembali
        </Link>

        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 relative overflow-hidden">
          {/* Decorative line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500" />

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">
              Pilih Username
            </h1>
            <p className="text-gray-500 text-sm">
              Ini akan menjadi alamat link bio kamu yang unik
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Success Info */}
          {isAvailable === true && username.length >= 3 && (
            <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2">
              <CheckCircle size={16} className="text-green-600" />
              <p className="text-green-700 text-sm">Username tersedia!</p>
            </div>
          )}

          <form onSubmit={handleNext} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                  <span className="pl-4 text-gray-500 text-sm font-medium bg-gray-50 py-4">
                    easybio.com/
                  </span>
                  <input 
                    type="text" 
                    className="p-4 outline-none flex-1 font-medium text-gray-900 bg-gray-50 placeholder:text-gray-400"
                    placeholder="usernameanda"
                    value={username}
                    onChange={(e) => {
                      const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')
                      setUsername(value)
                      setError('')
                    }}
                    required 
                  />
                  {checking && (
                    <div className="pr-4">
                      <Loader2 size={18} className="animate-spin text-gray-400" />
                    </div>
                  )}
                  {isAvailable === true && !checking && username.length >= 3 && (
                    <div className="pr-4">
                      <CheckCircle size={18} className="text-green-500" />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Username rules */}
              <div className="mt-3 space-y-1">
                <p className="text-xs text-gray-500">
                  • Minimal 3 karakter, maksimal 20 karakter
                </p>
                <p className="text-xs text-gray-500">
                  • Hanya huruf, angka, dan underscore (_)
                </p>
                <p className="text-xs text-gray-500">
                  • Username bersifat case-insensitive
                </p>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading || !username || isAvailable === false || username.length < 3}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white p-4 rounded-xl font-semibold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Menyimpan...
                </>
              ) : (
                <>
                  Lanjut ke Profil
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-center text-xs text-gray-500">
              Username bisa diubah nanti di pengaturan akun
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-[10px] text-gray-400 uppercase tracking-wider font-medium">
          Step 1 of 2 • Setup Profile
        </p>
      </div>
    </div>
  )
}