'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminPage() {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault()
    // Menambah data ke tabel 'links' di Supabase
    const { error } = await supabase.from('links').insert([{ title, url }])
    
    if (error) {
      alert('Gagal: ' + error.message)
    } else {
      alert('Link berhasil ditambah!')
      setTitle(''); setUrl('')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 text-black">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Dashboard</h1>
        <form onSubmit={handleAddLink} className="flex flex-col gap-4">
          <input 
            type="text" 
            placeholder="Nama Link (Contoh: Shopee)" 
            className="p-3 border rounded-xl"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input 
            type="url" 
            placeholder="URL (https://...)" 
            className="p-3 border rounded-xl"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <button type="submit" className="bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700 transition">
            Tambah Link
          </button>
        </form>
        <a href="/" className="block text-center mt-6 text-gray-500 text-sm underline">Lihat Halaman Bio</a>
      </div>
    </div>
  )
}