'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { CheckCircle, Palette, Sun, Moon, Droplet, Flame, Leaf, Heart, Star, Crown, Sparkles } from 'lucide-react'

const themes = [
  { id: 'light', name: 'Light', icon: Sun, bg: 'bg-white', text: 'text-gray-900', preview: 'bg-white border-gray-200' },
  { id: 'dark', name: 'Dark', icon: Moon, bg: 'bg-gray-900', text: 'text-white', preview: 'bg-gray-900 border-gray-700' },
  { id: 'ocean', name: 'Ocean', icon: Droplet, bg: 'bg-gradient-to-br from-blue-600 to-cyan-500', text: 'text-white', preview: 'bg-gradient-to-br from-blue-600 to-cyan-500' },
  { id: 'sunset', name: 'Sunset', icon: Flame, bg: 'bg-gradient-to-br from-orange-500 to-pink-500', text: 'text-white', preview: 'bg-gradient-to-br from-orange-500 to-pink-500' },
  { id: 'forest', name: 'Forest', icon: Leaf, bg: 'bg-gradient-to-br from-emerald-600 to-teal-500', text: 'text-white', preview: 'bg-gradient-to-br from-emerald-600 to-teal-500' },
  { id: 'lavender', name: 'Lavender', icon: Heart, bg: 'bg-gradient-to-br from-purple-500 to-pink-500', text: 'text-white', preview: 'bg-gradient-to-br from-purple-500 to-pink-500' },
  { id: 'midnight', name: 'Midnight', icon: Star, bg: 'bg-gradient-to-br from-indigo-900 to-purple-900', text: 'text-white', preview: 'bg-gradient-to-br from-indigo-900 to-purple-900' },
  { id: 'royal', name: 'Royal', icon: Crown, bg: 'bg-gradient-to-br from-amber-700 to-yellow-600', text: 'text-white', preview: 'bg-gradient-to-br from-amber-700 to-yellow-600' },
  { id: 'galaxy', name: 'Galaxy', icon: Sparkles, bg: 'bg-gradient-to-br from-purple-800 to-pink-700', text: 'text-white', preview: 'bg-gradient-to-br from-purple-800 to-pink-700' },
]

export default function ThemesPage() {
  const [selectedTheme, setSelectedTheme] = useState('light')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    loadTheme()
  }, [])

  const loadTheme = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('profiles')
        .select('theme_preference')
        .eq('id', user.id)
        .single()

      if (data?.theme_preference) {
        setSelectedTheme(data.theme_preference)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const saveTheme = async () => {
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('profiles')
        .update({ theme_preference: selectedTheme })
        .eq('id', user.id)

      if (error) throw error

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      alert('Failed to save theme')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Customize Theme</h1>
        <p className="text-gray-500 text-sm mt-1">Choose a theme that represents your style</p>
      </div>

      {/* Theme Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {themes.map((theme) => {
          const Icon = theme.icon
          const isSelected = selectedTheme === theme.id
          return (
            <button
              key={theme.id}
              onClick={() => setSelectedTheme(theme.id)}
              className={`relative rounded-2xl overflow-hidden transition-all ${
                isSelected ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
              }`}
            >
              <div className={`${theme.preview} p-8 text-center`}>
                <Icon size={32} className={`mx-auto mb-3 ${theme.text}`} />
                <p className={`font-semibold ${theme.text}`}>{theme.name}</p>
              </div>
              {isSelected && (
                <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
                  <CheckCircle size={14} className="text-white" />
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Live Preview */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8">
        <h2 className="font-semibold text-gray-900 mb-4">Live Preview</h2>
        <div className={`${themes.find(t => t.id === selectedTheme)?.bg} rounded-2xl p-8 text-center transition-all duration-300`}>
          <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-4" />
          <div className={`h-4 w-32 rounded-full mx-auto mb-2 ${themes.find(t => t.id === selectedTheme)?.text} bg-current opacity-70`} />
          <div className={`h-3 w-24 rounded-full mx-auto ${themes.find(t => t.id === selectedTheme)?.text} bg-current opacity-40`} />
          <div className="mt-6 space-y-2">
            <div className="h-12 rounded-lg bg-white/10 backdrop-blur-sm" />
            <div className="h-12 rounded-lg bg-white/10 backdrop-blur-sm" />
            <div className="h-12 rounded-lg bg-white/10 backdrop-blur-sm" />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-between bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div>
          <p className="font-medium text-gray-900">Apply Theme</p>
          <p className="text-sm text-gray-500">This theme will be applied to your public profile</p>
        </div>
        <button
          onClick={saveTheme}
          disabled={saving}
          className="bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-all disabled:opacity-50"
        >
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Theme'}
        </button>
      </div>
    </div>
  )
}