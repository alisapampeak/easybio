'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { TrendingUp, MousePointer, Users, Eye, Calendar, ArrowUp, ArrowDown } from 'lucide-react'

export default function AnalyticsPage() {
  const [links, setLinks] = useState<any[]>([])
  const [totalClicks, setTotalClicks] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', user.id)
      
      setLinks(data || [])
      const total = data?.reduce((sum, link) => sum + (link.clicks || 0), 0) || 0
      setTotalClicks(total)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading analytics...</div>
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Track your page performance</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <MousePointer className="text-blue-600" size={24} />
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <p className="text-gray-500 text-sm font-medium">Total Clicks</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{totalClicks.toLocaleString()}</p>
          <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
            <ArrowUp size={12} /> +12% from last week
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
            <Users className="text-purple-600" size={24} />
          </div>
          <p className="text-gray-500 text-sm font-medium">Unique Visitors</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{Math.floor(totalClicks * 0.7).toLocaleString()}</p>
          <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
            <ArrowUp size={12} /> +8% from last week
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
            <Eye className="text-green-600" size={24} />
          </div>
          <p className="text-gray-500 text-sm font-medium">CTR Average</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">3.2%</p>
          <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
            <ArrowDown size={12} /> -0.5% from last week
          </p>
        </div>
      </div>

      {/* Pro Upgrade Message */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white mb-8">
        <h3 className="text-xl font-bold mb-2">Unlock Full Analytics</h3>
        <p className="text-blue-100 mb-6">Upgrade to Pro for detailed insights, click heatmaps, and audience demographics.</p>
        <button className="bg-white text-blue-600 px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all">
          Upgrade to Pro
        </button>
      </div>

      {/* Top Links */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Top Performing Links</h2>
        </div>
        {links.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No links added yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {links.sort((a, b) => (b.clicks || 0) - (a.clicks || 0)).map((link) => (
              <div key={link.id} className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">{link.title}</h3>
                  <span className="text-sm font-bold text-blue-600">{link.clicks || 0} clicks</span>
                </div>
                <p className="text-sm text-gray-500 truncate">{link.url}</p>
                <div className="mt-2 bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full rounded-full"
                    style={{ width: `${((link.clicks || 0) / totalClicks) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}