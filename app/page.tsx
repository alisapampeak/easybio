'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles, Zap, ShieldCheck, BarChart3, MousePointer2, Mail, ChevronRight, Star, Users, Globe, Clock, CheckCircle, Award, TrendingUp } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-500/20 overflow-x-hidden">
      
      {/* --- EFEK BACKGROUND SOFT --- */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-blue-50/50 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-50/40 blur-[120px] rounded-full"></div>
      </div>

      {/* --- NAVBAR --- */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'border-b border-gray-200 bg-white/90 backdrop-blur-xl shadow-sm' : 'bg-white/80 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-black text-lg">E</span>
            </div>
            <div className="text-xl font-bold tracking-tight text-gray-900">
              EasyBio.
            </div>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-300">
              Fitur
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-300">
              Harga
            </Link>
            <Link href="#testimonials" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-300">
              Testimoni
            </Link>
            <Link href="#faq" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-300">
              FAQ
            </Link>
          </div>
          
          <div className="flex gap-3">
            <Link href="/login" className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-all duration-300">
              Login
            </Link>
            <Link href="/register" className="group relative bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:bg-gray-800 hover:shadow-md">
              Daftar Gratis
              <ArrowRight className="inline-block ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full text-xs font-semibold text-blue-700 uppercase mb-6 animate-fade-in-down">
            <Sparkles size={14} className="text-blue-500" /> Platform Link Bio Premium
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-reveal text-gray-900">
            Link Bio yang
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400"> Professional</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed animate-fade-in-up">
            Tampilkan semua link pentingmu dalam satu halaman yang elegan. 
            Desain modern, analitik lengkap, dan mudah dikustomisasi.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up [animation-delay:0.3s]">
            <Link href="/register" className="group inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5">
              Mulai Gratis
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link href="#demo" className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:bg-gray-50 hover:border-gray-400">
              Lihat Demo
              <ChevronRight size={18} />
            </Link>
          </div>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-8 mt-12 pt-8 border-t border-gray-100">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">50K+</div>
              <div className="text-xs text-gray-500 mt-1">Pengguna Aktif</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">99.9%</div>
              <div className="text-xs text-gray-500 mt-1">Uptime</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-2xl font-bold text-gray-900">
                4.9 <Star size={18} className="fill-yellow-400 text-yellow-400" />
              </div>
              <div className="text-xs text-gray-500 mt-1">Rating Pengguna</div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full text-xs font-semibold text-blue-700 uppercase mb-4">
            <Sparkles size={14} /> Keunggulan Platform
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Lebih dari sekadar link bio biasa
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Dapatkan semua tools yang Anda butuhkan untuk membangun personal brand yang kuat
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Feature 1 */}
          <div className="bg-white border border-gray-100 rounded-2xl p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-blue-100 transition-colors duration-300">
              <Zap className="text-blue-600" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">Performa Super Cepat</h3>
            <p className="text-gray-600 leading-relaxed">Dibangun dengan teknologi modern untuk loading time tercepat di kelasnya.</p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white border border-gray-100 rounded-2xl p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-blue-100 transition-colors duration-300">
              <BarChart3 className="text-blue-600" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">Analitik Real-time</h3>
            <p className="text-gray-600 leading-relaxed">Pantau klik, viewer, dan performa linkmu secara detail dan akurat.</p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white border border-gray-100 rounded-2xl p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-blue-100 transition-colors duration-300">
              <MousePointer2 className="text-blue-600" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">Drag & Drop Builder</h3>
            <p className="text-gray-600 leading-relaxed">Kelola link dengan mudah. Cukup drag, drop, dan atur sesuai keinginan.</p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white border border-gray-100 rounded-2xl p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-blue-100 transition-colors duration-300">
              <Globe className="text-blue-600" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">Custom Domain</h3>
            <p className="text-gray-600 leading-relaxed">Gunakan domain sendiri untuk branding yang lebih profesional dan konsisten.</p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white border border-gray-100 rounded-2xl p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-blue-100 transition-colors duration-300">
              <ShieldCheck className="text-blue-600" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">Keamanan Terjamin</h3>
            <p className="text-gray-600 leading-relaxed">Enkripsi SSL dan proteksi data sesuai standar keamanan internasional.</p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white border border-gray-100 rounded-2xl p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-blue-100 transition-colors duration-300">
              <Users className="text-blue-600" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">Dukungan 24/7</h3>
            <p className="text-gray-600 leading-relaxed">Tim support kami siap membantu kapanpun Anda membutuhkan bantuan.</p>
          </div>
        </div>
      </section>

      {/* --- PRICING SECTION --- */}
      <section id="pricing" className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full text-xs font-semibold text-blue-700 uppercase mb-4">
              <Award size={14} /> Pilihan Harga
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Pilih paket yang sesuai
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Mulai dari gratis hingga enterprise. Pilih yang paling sesuai dengan kebutuhanmu
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            
            {/* Free Plan */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 transition-all duration-300 hover:shadow-xl">
              <h3 className="text-xl font-bold mb-2 text-gray-900">Gratis</h3>
              <div className="text-4xl font-bold mb-1 text-gray-900">Rp0</div>
              <p className="text-gray-500 text-sm mb-6">/bulan, selamanya</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle size={16} className="text-green-500" /> 1 Bio Page</li>
                <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle size={16} className="text-green-500" /> Unlimited Links</li>
                <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle size={16} className="text-green-500" /> Basic Analytics</li>
                <li className="flex items-center gap-2 text-sm text-gray-400"><span className="w-4 h-4 inline-block"></span> Custom Domain</li>
              </ul>
              <Link href="/register" className="block text-center border border-gray-300 rounded-xl py-3 font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-300">
                Mulai Gratis
              </Link>
            </div>
            
            {/* Pro Plan - Highlighted */}
            <div className="bg-white rounded-2xl p-8 border-2 border-blue-500 shadow-xl relative transform scale-105 transition-all duration-300 hover:shadow-2xl">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-4 py-1 rounded-full font-semibold">
                PALING POPULER
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Pro</h3>
              <div className="text-4xl font-bold mb-1 text-gray-900">Rp99rb</div>
              <p className="text-gray-500 text-sm mb-6">/bulan, tagihan bulanan</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle size={16} className="text-green-500" /> 10 Bio Pages</li>
                <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle size={16} className="text-green-500" /> Unlimited Links</li>
                <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle size={16} className="text-green-500" /> Advanced Analytics</li>
                <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle size={16} className="text-green-500" /> Custom Domain</li>
                <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle size={16} className="text-green-500" /> Priority Support</li>
              </ul>
              <Link href="/register" className="block text-center bg-gray-900 text-white rounded-xl py-3 font-semibold hover:bg-gray-800 transition-all duration-300">
                Pilih Pro
              </Link>
            </div>
            
            {/* Business Plan */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 transition-all duration-300 hover:shadow-xl">
              <h3 className="text-xl font-bold mb-2 text-gray-900">Business</h3>
              <div className="text-4xl font-bold mb-1 text-gray-900">Rp299rb</div>
              <p className="text-gray-500 text-sm mb-6">/bulan, tagihan bulanan</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle size={16} className="text-green-500" /> Unlimited Pages</li>
                <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle size={16} className="text-green-500" /> Unlimited Links</li>
                <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle size={16} className="text-green-500" /> Advanced + API</li>
                <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle size={16} className="text-green-500" /> Multiple Domains</li>
                <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle size={16} className="text-green-500" /> Dedicated Support</li>
              </ul>
              <Link href="/register" className="block text-center border border-gray-300 rounded-xl py-3 font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-300">
                Hubungi Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS SECTION --- */}
      <section id="testimonials" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full text-xs font-semibold text-blue-700 uppercase mb-4">
            <Star size={14} /> Testimoni
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Apa kata mereka?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Ribuan kreator telah mempercayakan link bio mereka kepada kami
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />)}
            </div>
            <p className="text-gray-600 mb-4 leading-relaxed">"Platform yang sangat membantu untuk personal branding. Desainnya clean dan profesional."</p>
            <p className="font-semibold text-gray-900">Ahmad Rizki</p>
            <p className="text-sm text-gray-500">Content Creator</p>
          </div>
          
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />)}
            </div>
            <p className="text-gray-600 mb-4 leading-relaxed">"Fitur analitiknya sangat membantu saya memahami audiens. Highly recommended!"</p>
            <p className="font-semibold text-gray-900">Sarah Devina</p>
            <p className="text-sm text-gray-500">Digital Marketer</p>
          </div>
          
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />)}
            </div>
            <p className="text-gray-600 mb-4 leading-relaxed">"Drag & drop-nya sangat intuitif. Dalam 5 menit landing page saya sudah jadi!"</p>
            <p className="font-semibold text-gray-900">Budi Santoso</p>
            <p className="text-sm text-gray-500">Podcaster</p>
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section id="faq" className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full text-xs font-semibold text-blue-700 uppercase mb-4">
              FAQ
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Pertanyaan Umum
            </h2>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Apakah bisa menggunakan domain sendiri?</h3>
              <p className="text-gray-600">Ya, di paket Pro dan Business Anda bisa menggunakan custom domain untuk branding yang lebih profesional.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Bagaimana dengan keamanan data?</h3>
              <p className="text-gray-600">Kami menggunakan enkripsi SSL 256-bit dan mematuhi standar keamanan GDPR untuk melindungi data Anda.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Apakah ada batasan jumlah link?</h3>
              <p className="text-gray-600">Tidak ada batasan! Anda bisa menambahkan unlimited links di semua paket.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Bisa upgrade paket kapan saja?</h3>
              <p className="text-gray-600">Tentu! Anda bisa upgrade atau downgrade paket kapan saja melalui dashboard akun Anda.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-12 border border-blue-100">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Siap membangun personal brand-mu?
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Bergabung dengan ribuan kreator yang sudah menggunakan EasyBio
            </p>
            <Link href="/register" className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 hover:shadow-lg">
              Mulai Gratis Sekarang
              <ArrowRight size={18} />
            </Link>
            <p className="text-xs text-gray-500 mt-4">*Gratis selamanya. Tidak perlu kartu kredit.</p>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">E</span>
                </div>
                <div className="text-xl font-bold text-gray-900">EasyBio.</div>
              </div>
              <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                Platform link bio modern dengan analitik cerdas & desain profesional.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 text-sm mb-4">Produk</h4>
              <ul className="space-y-2">
                <li><Link href="#features" className="text-gray-500 text-sm hover:text-gray-900 transition-colors">Fitur</Link></li>
                <li><Link href="#pricing" className="text-gray-500 text-sm hover:text-gray-900 transition-colors">Harga</Link></li>
                <li><Link href="#" className="text-gray-500 text-sm hover:text-gray-900 transition-colors">API</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 text-sm mb-4">Perusahaan</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-500 text-sm hover:text-gray-900 transition-colors">Tentang</Link></li>
                <li><Link href="#" className="text-gray-500 text-sm hover:text-gray-900 transition-colors">Blog</Link></li>
                <li><Link href="#" className="text-gray-500 text-sm hover:text-gray-900 transition-colors">Kontak</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 text-sm mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-500 text-sm hover:text-gray-900 transition-colors">Privasi</Link></li>
                <li><Link href="#" className="text-gray-500 text-sm hover:text-gray-900 transition-colors">Syarat</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-100 mt-8 pt-8 text-center text-gray-400 text-xs">
            &copy; 2025 EasyBio. All rights reserved.
          </div>
        </div>
      </footer>

      {/* --- GLOBAL STYLES --- */}
      <style jsx global>{`
        @keyframes reveal {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-reveal {
          animation: reveal 0.8s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.6s ease-out forwards;
          opacity: 0;
        }
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  )
}