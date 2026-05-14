'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { 
  CheckCircle, Loader2, ChevronLeft, Palette, 
  Sparkles, Zap, Heart, Sun, Moon, Cloud, 
  Flame, Leaf, Droplet, Crown, Star, Gem 
} from 'lucide-react'
import Link from 'next/link'

interface Theme {
  id: string
  name: string
  description: string
  bgClass: string
  textClass: string
  accentClass: string
  cardBgClass: string
  buttonClass: string
  icon: any
  tags: string[]
  popular?: boolean
  new?: boolean
}

const themes: Theme[] = [
  {
    id: 'light',
    name: 'Light',
    description: 'Clean & Professional',
    bgClass: 'bg-white',
    textClass: 'text-gray-900',
    accentClass: 'text-blue-600',
    cardBgClass: 'bg-gray-50',
    buttonClass: 'bg-gray-900 text-white hover:bg-gray-800',
    icon: Sun,
    tags: ['Minimalis', 'Professional']
  },
  {
    id: 'dark',
    name: 'Dark',
    description: 'Sleek & Modern',
    bgClass: 'bg-gray-900',
    textClass: 'text-white',
    accentClass: 'text-blue-400',
    cardBgClass: 'bg-gray-800',
    buttonClass: 'bg-blue-600 text-white hover:bg-blue-500',
    icon: Moon,
    tags: ['Modern', 'Elegant'],
    popular: true
  },
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Cool & Calm',
    bgClass: 'bg-gradient-to-br from-blue-600 to-cyan-500',
    textClass: 'text-white',
    accentClass: 'text-cyan-200',
    cardBgClass: 'bg-white/10 backdrop-blur-sm',
    buttonClass: 'bg-white text-blue-600 hover:bg-gray-100',
    icon: Droplet,
    tags: ['Cool', 'Fresh']
  },
  {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm & Energetic',
    bgClass: 'bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600',
    textClass: 'text-white',
    accentClass: 'text-yellow-200',
    cardBgClass: 'bg-white/10 backdrop-blur-sm',
    buttonClass: 'bg-white text-orange-600 hover:bg-gray-100',
    icon: Flame,
    tags: ['Warm', 'Vibrant']
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Natural & Fresh',
    bgClass: 'bg-gradient-to-br from-emerald-600 to-teal-500',
    textClass: 'text-white',
    accentClass: 'text-emerald-200',
    cardBgClass: 'bg-white/10 backdrop-blur-sm',
    buttonClass: 'bg-white text-emerald-600 hover:bg-gray-100',
    icon: Leaf,
    tags: ['Natural', 'Fresh']
  },
  {
    id: 'lavender',
    name: 'Lavender',
    description: 'Soft & Dreamy',
    bgClass: 'bg-gradient-to-br from-purple-500 via-pink-400 to-purple-600',
    textClass: 'text-white',
    accentClass: 'text-pink-200',
    cardBgClass: 'bg-white/10 backdrop-blur-sm',
    buttonClass: 'bg-white text-purple-600 hover:bg-gray-100',
    icon: Heart,
    tags: ['Soft', 'Dreamy']
  },
  {
    id: 'midnight',
    name: 'Midnight',
    description: 'Deep & Mysterious',
    bgClass: 'bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900',
    textClass: 'text-white',
    accentClass: 'text-indigo-300',
    cardBgClass: 'bg-white/5 backdrop-blur-sm',
    buttonClass: 'bg-indigo-600 text-white hover:bg-indigo-500',
    icon: Star,
    tags: ['Mysterious', 'Elegant']
  },
  {
    id: 'coral',
    name: 'Coral',
    description: 'Bright & Cheerful',
    bgClass: 'bg-gradient-to-br from-red-400 via-orange-400 to-pink-500',
    textClass: 'text-white',
    accentClass: 'text-yellow-200',
    cardBgClass: 'bg-white/10 backdrop-blur-sm',
    buttonClass: 'bg-white text-red-600 hover:bg-gray-100',
    icon: Zap,
    tags: ['Bright', 'Cheerful'],
    new: true
  },
  {
    id: 'mint',
    name: 'Mint',
    description: 'Cool & Refreshing',
    bgClass: 'bg-gradient-to-br from-teal-400 to-green-400',
    textClass: 'text-white',
    accentClass: 'text-teal-100',
    cardBgClass: 'bg-white/10 backdrop-blur-sm',
    buttonClass: 'bg-white text-teal-600 hover:bg-gray-100',
    icon: Leaf,
    tags: ['Cool', 'Refreshing']
  },
  {
    id: 'royal',
    name: 'Royal',
    description: 'Luxury & Premium',
    bgClass: 'bg-gradient-to-br from-amber-700 via-yellow-600 to-amber-800',
    textClass: 'text-white',
    accentClass: 'text-yellow-200',
    cardBgClass: 'bg-white/10 backdrop-blur-sm',
    buttonClass: 'bg-amber-700 text-white hover:bg-amber-600',
    icon: Crown,
    tags: ['Luxury', 'Premium'],
    popular: true
  },
  {
    id: 'galaxy',
    name: 'Galaxy',
    description: 'Cosmic & Vibrant',
    bgClass: 'bg-gradient-to-br from-purple-800 via-pink-700 to-indigo-900',
    textClass: 'text-white',
    accentClass: 'text-pink-300',
    cardBgClass: 'bg-white/5 backdrop-blur-sm',
    buttonClass: 'bg-purple-600 text-white hover:bg-purple-500',
    icon: Sparkles,
    tags: ['Cosmic', 'Vibrant'],
    new: true
  },
  {
    id: 'coffee',
    name: 'Coffee',
    description: 'Warm & Cozy',
    bgClass: 'bg-gradient-to-br from-amber-800 via-brown-700 to-amber-900',
    textClass: 'text-white',
    accentClass: 'text-amber-300',
    cardBgClass: 'bg-white/10 backdrop-blur-sm',
    buttonClass: 'bg-amber-700 text-white hover:bg-amber-600',
    icon: Heart,
    tags: ['Warm', 'Cozy']
  }
]

export default function StepTheme() {
  const [selectedTheme, setSelectedTheme] = useState<string>('light')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState<string>('All')
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    loadSavedTheme()
  }, [])

  const loadSavedTheme = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('profiles')
        .select('theme_preference')
        .eq('id', user.id)
        .single()

      if (data && data.theme_preference) {
        setSelectedTheme(data.theme_preference)
      }
    } catch (err) {
      console.error('Error loading theme:', err)
    }
  }

  const saveTheme = async () => {
    setSaving(true)
    setError('')

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
          theme_preference: selectedTheme,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (updateError) throw updateError

      setSuccess(true)
      
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
      
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.')
      setSaving(false)
    }
  }

  const filteredThemes = themes.filter(theme => {
    const matchesSearch = theme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          theme.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          theme.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesTag = selectedTag === 'All' || theme.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  const allTags = ['All', ...new Set(themes.flatMap(t => t.tags))]

  const selectedThemeData = themes.find(t => t.id === selectedTheme)

  if (!mounted) return null

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl border border-gray-100">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-900">Tema Tersimpan!</h2>
          <p className="text-gray-600 mb-6">
            Tema {selectedThemeData?.name} telah diterapkan.
            <br />
            Mengalihkan ke dashboard...
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

      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link 
          href="/create/links" 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-all mb-6 text-sm font-medium group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          Kembali ke Link
        </Link>

        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Palette className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 mb-2">
              Pilih Tema Kustomisasi
            </h1>
            <p className="text-gray-500 text-sm max-w-lg mx-auto">
              Pilih tema yang paling mencerminkan kepribadian dan brand kamu
            </p>
          </div>

          {/* Search & Filter */}
          <div className="mb-8 space-y-4">
            <input
              type="text"
              placeholder="Cari tema..."
              className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all text-gray-900 placeholder:text-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    selectedTag === tag
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <span className="text-red-500">⚠️</span>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Theme Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8 max-h-[500px] overflow-y-auto p-2">
            {filteredThemes.map((theme) => {
              const IconComponent = theme.icon
              const isSelected = selectedTheme === theme.id
              
              return (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme.id)}
                  className={`group relative rounded-xl overflow-hidden transition-all duration-300 ${
                    isSelected ? 'ring-2 ring-purple-500 shadow-lg' : 'hover:shadow-md'
                  }`}
                >
                  {/* Theme Preview Card */}
                  <div className={`${theme.bgClass} p-4 h-32 flex flex-col items-center justify-center relative`}>
                    {theme.popular && (
                      <div className="absolute top-2 right-2 bg-yellow-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        POPULER
                      </div>
                    )}
                    {theme.new && (
                      <div className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        NEW
                      </div>
                    )}
                    <IconComponent className={`w-8 h-8 mb-2 ${theme.accentClass}`} />
                    <div className={`w-12 h-1 rounded-full mb-1 ${theme.accentClass} opacity-50`} />
                    <div className={`w-16 h-1 rounded-full ${theme.accentClass} opacity-30`} />
                  </div>
                  
                  {/* Theme Info */}
                  <div className="bg-white p-3 text-center border-t border-gray-100">
                    <h3 className={`font-bold text-sm ${isSelected ? 'text-purple-600' : 'text-gray-900'}`}>
                      {theme.name}
                    </h3>
                    <p className="text-[10px] text-gray-500 mt-0.5">{theme.description}</p>
                    <div className="flex flex-wrap gap-1 justify-center mt-2">
                      {theme.tags.map(tag => (
                        <span key={tag} className="text-[8px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Selected Indicator */}
                  {isSelected && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="bg-purple-500 rounded-full p-1">
                        <CheckCircle size={20} className="text-white" />
                      </div>
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {/* Live Preview */}
          {selectedThemeData && (
            <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles size={16} className="text-purple-500" />
                Preview Live
              </h3>
              <div className={`${selectedThemeData.bgClass} rounded-xl p-6 transition-all duration-300`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full"></div>
                  <div>
                    <div className={`h-3 w-24 rounded-full ${selectedThemeData.accentClass} bg-current opacity-70`} />
                    <div className={`h-2 w-16 rounded-full mt-1 ${selectedThemeData.accentClass} bg-current opacity-40`} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className={`h-10 rounded-lg ${selectedThemeData.cardBgClass} backdrop-blur-sm`} />
                  <div className={`h-10 rounded-lg ${selectedThemeData.cardBgClass} backdrop-blur-sm`} />
                  <div className={`h-10 rounded-lg ${selectedThemeData.cardBgClass} backdrop-blur-sm`} />
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={saveTheme}
              disabled={saving}
              className="flex-1 bg-gray-900 hover:bg-gray-800 text-white p-4 rounded-xl font-semibold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Menyimpan...
                </>
              ) : (
                <>
                  Simpan & Selesai
                  <CheckCircle size={16} />
                </>
              )}
            </button>
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">
            Tema dapat diubah kapan saja di halaman pengaturan
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mt-8 flex justify-center items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gray-300" />
          <div className="w-2 h-2 rounded-full bg-gray-300" />
          <div className="w-2 h-2 rounded-full bg-gray-300" />
          <div className="w-2 h-2 rounded-full bg-purple-600" />
        </div>
        <p className="text-center text-[10px] text-gray-400 uppercase tracking-wider font-medium mt-2">
          Step 4 of 4 • Pilih Tema
        </p>
      </div>
    </div>
  )
}