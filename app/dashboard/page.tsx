'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { MousePointer, Users, Link as LinkIcon, TrendingUp, Eye, Calendar } from 'lucide-react'

export default function DashboardHome() {
  const [profile, setProfile] = useState<any>(null)
  const [links, setLinks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ clicks: 0, visitors: 0, links: 0 })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Load profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      setProfile(profileData)

      // Load links
      const { data: linksData } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', user.id)
      setLinks(linksData || [])
      
      const totalClicks = linksData?.reduce((sum, link) => sum + (link.clicks || 0), 0) || 0
      setStats({
        clicks: totalClicks,
        visitors: Math.floor(totalClicks * 0.7),
        links: linksData?.length || 0
      })
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Welcome Header */}
      <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {profile?.full_name?.split(' ')[0] || 'User'}! 👋
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Your bio page is live at: 
              <a href={`/${profile?.username}`} target="_blank" className="text-blue-600 font-medium ml-1 hover:underline">
                easybio.com/{profile?.username}
              </a>
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href={`/${profile?.username}`}
              target="_blank"
              className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-sm hover:bg-gray-800 transition-all"
            >
              <Eye size={16} />
              View Page
            </a>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <MousePointer className="text-blue-600" size={24} />
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <p className="text-gray-500 text-sm font-medium">Total Clicks</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{stats.clicks.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
            <Users className="text-purple-600" size={24} />
          </div>
          <p className="text-gray-500 text-sm font-medium">Unique Visitors</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{stats.visitors.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
            <LinkIcon className="text-green-600" size={24} />
          </div>
          <p className="text-gray-500 text-sm font-medium">Active Links</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{stats.links}</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h2 className="font-bold text-lg text-gray-900 mb-4">Recent Activity</h2>
        {links.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No links added yet. Start by adding your first link!</p>
            <a href="/dashboard/links" className="inline-block mt-4 text-blue-600 hover:underline">
              Add Link →
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            {links.slice(0, 5).map((link) => (
              <div key={link.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900">{link.title}</p>
                  <p className="text-xs text-gray-500 truncate max-w-md">{link.url}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{link.clicks || 0}</p>
                  <p className="text-xs text-gray-400">clicks</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}