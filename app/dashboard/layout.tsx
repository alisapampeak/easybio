'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import {
  LayoutDashboard, Link as LinkIcon, Share2, Palette, User, 
  BarChart3, Settings, LogOut, Menu, X, Globe
} from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        setUser(user)
      }
    }
    getUser()
  }, [router])

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { id: 'links', label: 'Links', icon: LinkIcon, href: '/dashboard/links' },
    { id: 'social', label: 'Social Media', icon: Share2, href: '/dashboard/social' },
    { id: 'themes', label: 'Themes', icon: Palette, href: '/dashboard/themes' },
    { id: 'profile', label: 'Profile', icon: User, href: '/dashboard/profile' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/dashboard/analytics' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/dashboard/settings' },
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 px-4 py-3">
        <div className="flex items-center justify-between">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
            <Menu size={24} />
          </button>
          <div className="font-bold text-xl text-blue-600">EasyBio.</div>
          <div className="w-10" />
        </div>
      </div>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-40 transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } lg:w-64 w-72`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <div className="font-bold text-xl text-gray-900">EasyBio.</div>
            </div>
            <p className="text-xs text-gray-400 mt-2">Dashboard</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-medium text-red-500 hover:bg-red-50 transition-all"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}