import { supabase } from '@/lib/supabase'

export default async function Home() {
  // Mengambil data dari tabel 'links' di Supabase
  const { data: links } = await supabase.from('links').select('*')

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4 text-black">
      <div className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-sm text-center border border-gray-100">
        <div className="w-24 h-24 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold">@BioLinkSaya</h1>
        <p className="text-gray-500 text-sm mb-6">Database Connected!</p>
        
        <div className="flex flex-col gap-3">
          {links?.map((link) => (
            <a 
              key={link.id} 
              href={link.url} 
              target="_blank" 
              className="p-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-all"
            >
              {link.title}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}