import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { Globe, ExternalLink, Mail, Link2, Sparkles } from 'lucide-react'

// Fungsi untuk mendapatkan icon berdasarkan tipe
const getIcon = (iconType: string) => {
  const icons: Record<string, any> = {
    instagram: Instagram,
    twitter: Twitter,
    youtube: Youtube,
    github: Github,
    linkedin: Linkedin,
    email: Mail,
    globe: Globe,
    link: Link2,
  }
  const Icon = icons[iconType] || Globe
  return Icon
}

export default async function PublicProfile({ params }: { params: { username: string } }) {
  // Await params di Next.js 15
  const { username } = await params
  
  // 1. Ambil data profil berdasarkan username di URL
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  // Debug: log error jika ada
  if (profileError) {
    console.error('Profile error:', profileError)
  }

  // Jika username tidak ditemukan, kasih error 404
  if (!profile) {
    notFound()
  }

  // 2. Ambil semua link milik user tersebut
  const { data: links, error: linksError } = await supabase
    .from('links')
    .select('*')
    .eq('user_id', profile.id)
    .order('order', { ascending: true })

  if (linksError) {
    console.error('Links error:', linksError)
  }

  // Tema yang dipilih user
  const theme = profile.theme_preference || 'light'
  
  // Theme mapping
  const themes: Record<string, any> = {
    light: {
      bg: 'bg-white',
      text: 'text-gray-900',
      accent: 'text-blue-600',
      cardBg: 'bg-gray-50',
      cardBorder: 'border-gray-200',
      cardHover: 'hover:border-blue-200',
      buttonBg: 'bg-white',
    },
    dark: {
      bg: 'bg-gray-900',
      text: 'text-white',
      accent: 'text-blue-400',
      cardBg: 'bg-gray-800',
      cardBorder: 'border-gray-700',
      cardHover: 'hover:border-blue-500',
      buttonBg: 'bg-gray-800',
    },
    ocean: {
      bg: 'bg-gradient-to-br from-blue-600 to-cyan-500',
      text: 'text-white',
      accent: 'text-cyan-200',
      cardBg: 'bg-white/10',
      cardBorder: 'border-white/20',
      cardHover: 'hover:border-white/40',
      buttonBg: 'bg-white/10',
    },
    sunset: {
      bg: 'bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600',
      text: 'text-white',
      accent: 'text-yellow-200',
      cardBg: 'bg-white/10',
      cardBorder: 'border-white/20',
      cardHover: 'hover:border-white/40',
      buttonBg: 'bg-white/10',
    },
    forest: {
      bg: 'bg-gradient-to-br from-emerald-600 to-teal-500',
      text: 'text-white',
      accent: 'text-emerald-200',
      cardBg: 'bg-white/10',
      cardBorder: 'border-white/20',
      cardHover: 'hover:border-white/40',
      buttonBg: 'bg-white/10',
    },
    lavender: {
      bg: 'bg-gradient-to-br from-purple-500 via-pink-400 to-purple-600',
      text: 'text-white',
      accent: 'text-pink-200',
      cardBg: 'bg-white/10',
      cardBorder: 'border-white/20',
      cardHover: 'hover:border-white/40',
      buttonBg: 'bg-white/10',
    },
    midnight: {
      bg: 'bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900',
      text: 'text-white',
      accent: 'text-indigo-300',
      cardBg: 'bg-white/5',
      cardBorder: 'border-white/10',
      cardHover: 'hover:border-white/20',
      buttonBg: 'bg-white/5',
    },
    coral: {
      bg: 'bg-gradient-to-br from-red-400 via-orange-400 to-pink-500',
      text: 'text-white',
      accent: 'text-yellow-200',
      cardBg: 'bg-white/10',
      cardBorder: 'border-white/20',
      cardHover: 'hover:border-white/40',
      buttonBg: 'bg-white/10',
    },
    mint: {
      bg: 'bg-gradient-to-br from-teal-400 to-green-400',
      text: 'text-white',
      accent: 'text-teal-100',
      cardBg: 'bg-white/10',
      cardBorder: 'border-white/20',
      cardHover: 'hover:border-white/40',
      buttonBg: 'bg-white/10',
    },
    royal: {
      bg: 'bg-gradient-to-br from-amber-700 via-yellow-600 to-amber-800',
      text: 'text-white',
      accent: 'text-yellow-200',
      cardBg: 'bg-white/10',
      cardBorder: 'border-white/20',
      cardHover: 'hover:border-white/40',
      buttonBg: 'bg-white/10',
    },
    galaxy: {
      bg: 'bg-gradient-to-br from-purple-800 via-pink-700 to-indigo-900',
      text: 'text-white',
      accent: 'text-pink-300',
      cardBg: 'bg-white/5',
      cardBorder: 'border-white/10',
      cardHover: 'hover:border-white/20',
      buttonBg: 'bg-white/5',
    },
    coffee: {
      bg: 'bg-gradient-to-br from-amber-800 via-brown-700 to-amber-900',
      text: 'text-white',
      accent: 'text-amber-300',
      cardBg: 'bg-white/10',
      cardBorder: 'border-white/20',
      cardHover: 'hover:border-white/40',
      buttonBg: 'bg-white/10',
    },
  }

  const currentTheme = themes[theme] || themes.light

  return (
    <div className={`min-h-screen ${currentTheme.bg} ${currentTheme.text} p-6`}>
      <div className="w-full max-w-[580px] mx-auto py-8 md:py-12">
        
        {/* Profile Section */}
        <div className="text-center mb-10">
          {/* Avatar */}
          <div className="relative inline-block">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name}
                className="w-28 h-28 rounded-full object-cover border-4 border-white/20 shadow-xl"
              />
            ) : (
              <div className={`w-28 h-28 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl font-bold shadow-xl ${currentTheme.cardBg} backdrop-blur-sm border ${currentTheme.cardBorder}`}>
                {profile.full_name?.charAt(0).toUpperCase() || profile.username?.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1.5 border-4 border-white">
              <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          {/* Name & Username */}
          <h1 className={`text-2xl font-bold mt-4 ${currentTheme.text}`}>
            {profile.full_name || profile.username}
          </h1>
          <p className={`${currentTheme.accent} text-sm mt-1 opacity-80`}>
            @{profile.username}
          </p>
          
          {/* Bio */}
          {profile.bio && (
            <p className={`mt-3 ${currentTheme.text} opacity-80 text-sm max-w-sm mx-auto`}>
              {profile.bio}
            </p>
          )}
        </div>

        {/* Links Section */}
        <div className="flex flex-col gap-3">
          {links && links.length > 0 ? (
            links.map((link) => {
              const Icon = getIcon(link.icon_type)
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={async () => {
                    // Track click (client-side)
                    try {
                      await fetch('/api/track-click', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ linkId: link.id })
                      })
                    } catch (error) {
                      console.error('Failed to track click:', error)
                    }
                  }}
                  className={`group w-full p-4 ${currentTheme.cardBg} backdrop-blur-sm border ${currentTheme.cardBorder} rounded-2xl flex items-center justify-between font-medium shadow-sm hover:shadow-lg transition-all duration-300 ${currentTheme.cardHover} transform hover:scale-[1.02]`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${currentTheme.cardBg} group-hover:${currentTheme.accent} transition-colors`}>
                      <Icon size={20} className={`${currentTheme.accent} opacity-80 group-hover:opacity-100`} />
                    </div>
                    <span className={`${currentTheme.text} font-medium`}>{link.title}</span>
                  </div>
                  <ExternalLink size={16} className={`${currentTheme.accent} opacity-60 group-hover:opacity-100 transition-opacity`} />
                </a>
              )
            })
          ) : (
            <div className={`text-center py-12 ${currentTheme.cardBg} backdrop-blur-sm rounded-2xl border ${currentTheme.cardBorder}`}>
              <Sparkles className={`mx-auto mb-3 ${currentTheme.accent} opacity-50`} size={32} />
              <p className={`${currentTheme.text} opacity-60`}>
                Belum ada link yang ditambahkan.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center">
          <a
            href="/"
            className={`inline-flex items-center gap-2 px-5 py-2.5 ${currentTheme.buttonBg} backdrop-blur-sm rounded-full shadow-sm border ${currentTheme.cardBorder} transition-all hover:scale-105`}
          >
            <span className="text-[10px] font-bold tracking-wider uppercase opacity-60">Powered by</span>
            <span className={`font-black text-sm ${currentTheme.accent}`}>EasyBio.</span>
          </a>
        </footer>
      </div>
    </div>
  )
}