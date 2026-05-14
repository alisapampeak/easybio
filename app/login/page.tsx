'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Mail, Lock, LogIn, Loader2, ChevronLeft, Eye, EyeOff, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    // Validasi email
    if (!email || !email.includes('@') || !email.includes('.')) {
      setErrorMsg('Email tidak valid')
      setLoading(false)
      return
    }

    // Validasi password
    if (!password || password.length < 6) {
      setErrorMsg('Password minimal 6 karakter')
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email: email.trim().toLowerCase(), 
        password 
      })
      
      if (error) {
        // Handle error spesifik
        if (error.message === 'Invalid login credentials') {
          setErrorMsg('Email atau password salah. Periksa kembali data Anda.')
        } else if (error.message.includes('Email not confirmed')) {
          setErrorMsg('Email belum diverifikasi. Silakan cek inbox Anda.')
        } else if (error.message.includes('rate limit')) {
          setErrorMsg('Terlalu banyak percobaan. Silakan coba lagi nanti.')
        } else {
          setErrorMsg('Gagal masuk. Silakan coba lagi.')
        }
        setLoading(false)
        return
      }
      
      if (data?.user) {
        // Login sukses - redirect ke dashboard
        router.push('/dashboard')
      } else {
        setErrorMsg('Terjadi kesalahan. Silakan coba lagi.')
        setLoading(false)
      }
    } catch (err) {
      console.error('Login error:', err)
      setErrorMsg('Terjadi kesalahan koneksi. Periksa koneksi internet Anda.')
      setLoading(false)
    }
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow Soft */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-100/40 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-100/30 blur-[100px] rounded-full -z-10" />
      
      <div className="w-full max-w-md relative">
        {/* Tombol Kembali ke Landing Page */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-all mb-8 text-sm font-medium group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          Kembali ke Beranda
        </Link>

        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 relative overflow-hidden">
          {/* Decorative line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500" />

          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-xl">E</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">
              Selamat Datang Kembali
            </h1>
            <p className="text-gray-500 text-sm">
              Masuk untuk mengelola link bio kamu
            </p>
          </div>

          {/* Alert Error */}
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Alamat Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input 
                  type="email" 
                  placeholder="nama@email.com" 
                  className="w-full bg-gray-50 border border-gray-200 p-4 pl-12 rounded-xl outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all text-gray-900 placeholder:text-gray-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <Link 
                  href="/forgot-password" 
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Lupa Password?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Masukkan password Anda" 
                  className="w-full bg-gray-50 border border-gray-200 p-4 pl-12 pr-12 rounded-xl outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all text-gray-900"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white p-4 rounded-xl font-semibold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Memproses...
                </>
              ) : (
                <>
                  Login
                  <LogIn size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-500 text-sm">
              Belum punya akun? 
              <Link href="/register" className="ml-2 text-gray-900 font-semibold hover:text-blue-600 transition-colors">
                Daftar Sekarang
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-[10px] text-gray-400 uppercase tracking-wider font-medium">
          © 2025 EasyBio. All rights reserved.
        </p>
      </div>
    </div>
  )
}