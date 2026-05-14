'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Validasi password strength
  const validatePassword = (pass: string) => {
    const hasMinLength = pass.length >= 6
    const hasNumber = /\d/.test(pass)
    const hasLetter = /[a-zA-Z]/.test(pass)
    
    if (!hasMinLength) return 'Password minimal 6 karakter'
    if (!hasNumber) return 'Password harus mengandung angka'
    if (!hasLetter) return 'Password harus mengandung huruf'
    return ''
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // Validasi email
    if (!email.includes('@') || !email.includes('.')) {
      setError('Email tidak valid')
      return
    }
    
    // Validasi password
    const passwordError = validatePassword(password)
    if (passwordError) {
      setError(passwordError)
      return
    }
    
    // Validasi konfirmasi password
    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok')
      return
    }
    
    setLoading(true)

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/create`,
          data: {
            email_confirmed: false
          }
        }
      })

      if (signUpError) {
        if (signUpError.message.includes('User already registered')) {
          setError('Email sudah terdaftar. Silakan login.')
        } else if (signUpError.message.includes('Password should be at least 6 characters')) {
          setError('Password minimal 6 karakter')
        } else {
          setError(signUpError.message)
        }
        setLoading(false)
        return
      }

      if (data.user && data.user.identities?.length === 0) {
        setError('Email sudah terdaftar. Silakan login.')
        setLoading(false)
        return
      }

      setSuccess(true)
      sessionStorage.setItem('pendingEmail', email)
      
      setTimeout(() => {
        router.push('/create')
      }, 2000)
      
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.')
      setLoading(false)
    }
  }

  const getPasswordStrength = () => {
    if (!password) return 0
    let strength = 0
    if (password.length >= 6) strength++
    if (password.length >= 8) strength++
    if (/\d/.test(password)) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    return Math.min(strength, 4)
  }

  const strengthLevel = getPasswordStrength()
  const strengthText = ['Sangat Lemah', 'Lemah', 'Sedang', 'Kuat', 'Sangat Kuat']
  const strengthColor = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-emerald-500']

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return null
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-900">Pendaftaran Berhasil!</h2>
          <p className="text-gray-600 mb-6">
            Selamat datang! Mengalihkan ke halaman pembuatan profil...
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
        {/* Logo / Back to Home */}
        <Link href="/" className="flex justify-center mb-8 group">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 tracking-tight">
              EasyBio.
            </div>
          </div>
        </Link>

        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">
              Buat Akun Baru
            </h1>
            <p className="text-gray-500 text-sm">
              Mulai perjalanan digitalmu dalam hitungan detik
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Input Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  className="w-full bg-gray-50 border border-gray-200 p-4 pl-12 rounded-xl outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all text-gray-900 placeholder:text-gray-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
            </div>

            {/* Input Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Minimal 6 karakter" 
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
              
              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1 h-1.5 mb-2">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`flex-1 rounded-full transition-all ${
                          level <= strengthLevel
                            ? strengthColor[strengthLevel - 1]
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    Kekuatan password: <span className="font-medium">{strengthText[strengthLevel - 1] || 'Belum diisi'}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Konfirmasi Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="Masukkan ulang password" 
                  className="w-full bg-gray-50 border border-gray-200 p-4 pl-12 pr-12 rounded-xl outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all text-gray-900"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  required 
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> Password tidak cocok
                </p>
              )}
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
                  Daftar Sekarang
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Sudah punya akun? 
              <Link href="/login" className="ml-2 text-gray-900 font-semibold hover:text-blue-600 transition-colors">
                Login di sini
              </Link>
            </p>
          </div>

          <p className="mt-6 text-center text-[11px] text-gray-400">
            Dengan mendaftar, Anda menyetujui 
            <Link href="/terms" className="text-gray-500 hover:text-gray-700 mx-1">Syarat & Ketentuan</Link>
            dan
            <Link href="/privacy" className="text-gray-500 hover:text-gray-700 ml-1">Kebijakan Privasi</Link>
          </p>
        </div>

        <p className="mt-8 text-center text-[10px] text-gray-400 uppercase tracking-wider font-medium">
          © 2025 EasyBio. All rights reserved.
        </p>
      </div>
    </div>
  )
}