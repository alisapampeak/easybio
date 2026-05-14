'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminPage() {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [links, setLinks] = useState<any[]>([])

  // Fungsi untuk mengambil daftar link dari database
  const fetchLinks = async () => {
    const { data } = await supabase.from('links').select('*').order('created_at', { ascending: false })
    if (data) setLinks(data)
  }

  // Jalankan fetchLinks saat halaman pertama kali dibuka
  useEffect(() => {
    fetchLinks()
  }, [])

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.from('links').insert([{ title, url }])
    if (error) {
      alert('Gagal: ' + error.message)
    } else {
      setTitle(''); setUrl('')
      fetchLinks() // Refresh daftar link setelah nambah
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Yakin mau hapus link ini?')) {
      await supabase.from('links').delete().eq('id', id)
      fetchLinks() // Refresh daftar link setelah hapus
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4 text-black">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Dashboard</h1>
        
        {/* Form Tambah */}
        <form onSubmit={handleAddLink} className="flex flex-col gap-4 mb-8">
          <input type="text" placeholder="Nama Link" className="p-3 border rounded-xl" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <input type="url" placeholder="URL (https://...)" className="p-3 border rounded-xl" value={url} onChange={(e) => setUrl(e.target.value)} required />
          <button type="submit" className="bg-blue-600 text-white p-3 rounded-xl font-bold">Tambah Link</button>
        </form>

        {/* Daftar Link yang Bisa Dihapus */}
        <h2 className="font-bold mb-4 border-b pb-2">Daftar Link Kamu:</h2>
        <div className="flex flex-col gap-3">
          {links.map((link) => (
            <div key={link.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border">
              <span className="text-sm font-medium">{link.title}</span>
              <button onClick={() => handleDelete(link.id)} className="text-red-500 text-xs font-bold bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition">
                Hapus
              </button>
            </div>
          ))}
        </div>
        
        <a href="/" className="block text-center mt-8 text-gray-400 text-sm underline">Kembali ke Halaman Bio</a>
      </div>
    </div>
  )
}