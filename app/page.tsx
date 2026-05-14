export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
      {/* Kartu Bio */}
      <div className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-sm text-center border border-gray-100">
        
        {/* Foto Profil Palsu */}
        <div className="w-24 h-24 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full mx-auto mb-4 shadow-md"></div>
        
        <h1 className="text-2xl font-bold text-gray-800">@NamaKamu</h1>
        <p className="text-gray-500 text-sm mb-6">Digital Creator | Explorer</p>
        
        {/* Daftar Link */}
        <div className="flex flex-col gap-3">
          <a href="https://instagram.com" target="_blank" className="p-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-all active:scale-95">
            Instagram
          </a>
          <a href="https://tiktok.com" target="_blank" className="p-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-all active:scale-95">
            TikTok
          </a>
          <a href="https://wa.me/123" target="_blank" className="p-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-all active:scale-95">
            WhatsApp Saya
          </a>
        </div>

        <p className="mt-8 text-xs text-gray-400">Created with EasyBio</p>
      </div>
    </div>
  )
}