import { useState, useEffect } from 'react';
import Masonry from '../../../(main)/Components/Masonry/Masonry';

export default function SettingsManager() {
  const [activeSection, setActiveSection] = useState('basic');
  const [settings, setSettings] = useState({
    // Pengaturan Website Dasar
    basic: {
      siteName: 'Kabinet Cineverso',
      siteDescription: 'Komunitas film mahasiswa Universitas Indonesia',
      siteUrl: 'https://cineverso.com',
      adminEmail: 'admin@cineverso.com',
      timezone: 'Asia/Jakarta',
      language: 'id',
      maintenanceMode: false
    },
    // Informasi Kontak dan Lokasi
    contact: {
      address: 'Universitas Indonesia, Depok, Jawa Barat',
      phone: '+62 812-3456-7890',
      email: 'info@cineverso.com',
      whatsapp: '+62 812-3456-7890',
      instagram: '@kabinetcineverso',
      twitter: '@cineverso_ui',
      facebook: 'Kabinet Cineverso UI',
      youtube: 'Kabinet Cineverso',
      linkedin: 'Kabinet Cineverso UI'
    },
    // Media Sosial dan Branding
    branding: {
      logo: '',
      favicon: '',
      ogImage: '',
      primaryColor: '#F59E0B',
      secondaryColor: '#3B82F6',
      accentColor: '#10B981',
      fontFamily: 'Inter',
      brandColors: {
        primary: '#F59E0B',
        secondary: '#3B82F6',
        accent: '#10B981',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6'
      }
    },
    // SEO dan Optimasi
    seo: {
      metaTitle: 'Kabinet Cineverso - Komunitas Film Mahasiswa UI',
      metaDescription: 'Bergabunglah dengan Kabinet Cineverso, komunitas film mahasiswa terdepan di Universitas Indonesia',
      metaKeywords: 'film, mahasiswa, kabinet, cineverso, komunitas, universitas indonesia',
      ogTitle: 'Kabinet Cineverso - Komunitas Film Mahasiswa',
      ogDescription: 'Temukan koleksi film terbaik dari Kabinet Cineverso',
      ogImage: '',
      twitterCard: 'summary_large_image',
      twitterTitle: 'Kabinet Cineverso - Komunitas Film Mahasiswa',
      twitterDescription: 'Bergabunglah dengan komunitas film mahasiswa terdepan',
      twitterImage: '',
      canonicalUrl: 'https://cineverso.com',
      robots: 'index, follow',
      sitemap: 'https://cineverso.com/sitemap.xml'
    }
  });

  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageType, setSelectedImageType] = useState('');
  const [uploadedImages, setUploadedImages] = useState([]);

  // Sample images untuk Masonry (bisa diganti dengan data dari database)
  const sampleImages = [
    { id: 1, img: '/Images/nolder-logo.png', url: '#', height: 200 },
    { id: 2, img: '/Images/nolder-logo-item.png', url: '#', height: 150 },
    { id: 3, img: '/Images/poster-film/TBFSP.jpg', url: '#', height: 250 },
    { id: 4, img: '/Images/nolder-logo.png', url: '#', height: 180 },
    { id: 5, img: '/Images/nolder-logo-item.png', url: '#', height: 220 },
    { id: 6, img: '/Images/poster-film/TBFSP.jpg', url: '#', height: 190 }
  ];

  const sections = [
    { id: 'basic', title: 'Pengaturan Website Dasar', icon: '⚙️' },
    { id: 'contact', title: 'Informasi Kontak dan Lokasi', icon: '📞' },
    { id: 'branding', title: 'Media Sosial dan Branding', icon: '🎨' },
    { id: 'seo', title: 'SEO dan Optimasi Mesin Pencari', icon: '🔍' },
    { id: 'maintenance', title: 'Toggle Maintenance', icon: '' }
  ];

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleColorChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleImageSelect = (imageUrl) => {
    if (selectedImageType) {
      setSettings(prev => ({
        ...prev,
        [selectedImageType.split('.')[0]]: {
          ...prev[selectedImageType.split('.')[0]],
          [selectedImageType.split('.')[1]]: imageUrl
        }
      }));
    }
    setShowImageModal(false);
    setSelectedImageType('');
  };

  const openImageModal = (imageType) => {
    setSelectedImageType(imageType);
    setShowImageModal(true);
  };

  const renderBasicSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Nama Website
          </label>
          <input
            type="text"
            value={settings.basic.siteName}
            onChange={(e) => handleInputChange('basic', 'siteName', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            URL Website
          </label>
          <input
            type="url"
            value={settings.basic.siteUrl}
            onChange={(e) => handleInputChange('basic', 'siteUrl', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Deskripsi Website
        </label>
        <textarea
          value={settings.basic.siteDescription}
          onChange={(e) => handleInputChange('basic', 'siteDescription', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email Admin
          </label>
          <input
            type="email"
            value={settings.basic.adminEmail}
            onChange={(e) => handleInputChange('basic', 'adminEmail', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Timezone
          </label>
          <select
            value={settings.basic.timezone}
            onChange={(e) => handleInputChange('basic', 'timezone', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="Asia/Jakarta">Asia/Jakarta</option>
            <option value="Asia/Makassar">Asia/Makassar</option>
            <option value="Asia/Jayapura">Asia/Jayapura</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderContactSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Alamat
        </label>
        <textarea
          value={settings.contact.address}
          onChange={(e) => handleInputChange('contact', 'address', e.target.value)}
          rows={2}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Telepon
          </label>
          <input
            type="tel"
            value={settings.contact.phone}
            onChange={(e) => handleInputChange('contact', 'phone', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            value={settings.contact.email}
            onChange={(e) => handleInputChange('contact', 'email', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            WhatsApp
          </label>
          <input
            type="tel"
            value={settings.contact.whatsapp}
            onChange={(e) => handleInputChange('contact', 'whatsapp', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Instagram
          </label>
          <input
            type="text"
            value={settings.contact.instagram}
            onChange={(e) => handleInputChange('contact', 'instagram', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Twitter
          </label>
          <input
            type="text"
            value={settings.contact.twitter}
            onChange={(e) => handleInputChange('contact', 'twitter', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Facebook
          </label>
          <input
            type="text"
            value={settings.contact.facebook}
            onChange={(e) => handleInputChange('contact', 'facebook', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            YouTube
          </label>
          <input
            type="text"
            value={settings.contact.youtube}
            onChange={(e) => handleInputChange('contact', 'youtube', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            LinkedIn
          </label>
          <input
            type="text"
            value={settings.contact.linkedin}
            onChange={(e) => handleInputChange('contact', 'linkedin', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
      </div>
    </div>
  );

  const renderBrandingSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Logo Website
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={settings.branding.logo}
              onChange={(e) => handleInputChange('branding', 'logo', e.target.value)}
              className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <button
              onClick={() => openImageModal('branding.logo')}
              className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Pilih Gambar
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Favicon
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={settings.branding.favicon}
              onChange={(e) => handleInputChange('branding', 'favicon', e.target.value)}
              className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <button
              onClick={() => openImageModal('branding.favicon')}
              className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Pilih Gambar
            </button>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Open Graph Image
        </label>
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={settings.branding.ogImage}
            onChange={(e) => handleInputChange('branding', 'ogImage', e.target.value)}
            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <button
            onClick={() => openImageModal('branding.ogImage')}
            className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Pilih Gambar
          </button>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-semibold text-white mb-4">Warna Brand</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(settings.branding.brandColors).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-300 mb-2 capitalize">
                {key}
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={value}
                  onChange={(e) => handleColorChange('branding', 'brandColors', {
                    ...settings.branding.brandColors,
                    [key]: e.target.value
                  })}
                  className="w-12 h-10 rounded border border-gray-600 cursor-pointer"
                />
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleColorChange('branding', 'brandColors', {
                    ...settings.branding.brandColors,
                    [key]: e.target.value
                  })}
                  className="flex-1 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSEOSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Meta Title
        </label>
        <input
          type="text"
          value={settings.seo.metaTitle}
          onChange={(e) => handleInputChange('seo', 'metaTitle', e.target.value)}
          maxLength="60"
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        <p className="text-xs text-gray-400 mt-1">
          {settings.seo.metaTitle.length}/60 karakter
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Meta Description
        </label>
        <textarea
          value={settings.seo.metaDescription}
          onChange={(e) => handleInputChange('seo', 'metaDescription', e.target.value)}
          maxLength="160"
          rows={3}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        <p className="text-xs text-gray-400 mt-1">
          {settings.seo.metaDescription.length}/160 karakter
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Meta Keywords
        </label>
        <input
          type="text"
          value={settings.seo.metaKeywords}
          onChange={(e) => handleInputChange('seo', 'metaKeywords', e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            OG Title
          </label>
          <input
            type="text"
            value={settings.seo.ogTitle}
            onChange={(e) => handleInputChange('seo', 'ogTitle', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            OG Image
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={settings.seo.ogImage}
              onChange={(e) => handleInputChange('seo', 'ogImage', e.target.value)}
              className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <button
              onClick={() => openImageModal('seo.ogImage')}
              className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Pilih
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Twitter Title
          </label>
          <input
            type="text"
            value={settings.seo.twitterTitle}
            onChange={(e) => handleInputChange('seo', 'twitterTitle', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Twitter Image
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={settings.seo.twitterImage}
              onChange={(e) => handleInputChange('seo', 'twitterImage', e.target.value)}
              className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <button
              onClick={() => openImageModal('seo.twitterImage')}
              className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Pilih
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Canonical URL
          </label>
          <input
            type="url"
            value={settings.seo.canonicalUrl}
            onChange={(e) => handleInputChange('seo', 'canonicalUrl', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Robots
          </label>
          <select
            value={settings.seo.robots}
            onChange={(e) => handleInputChange('seo', 'robots', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="index, follow">Index, Follow</option>
            <option value="noindex, nofollow">No Index, No Follow</option>
            <option value="index, nofollow">Index, No Follow</option>
            <option value="noindex, follow">No Index, Follow</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderMaintenanceSettings = () => (
    <div className="space-y-6">
      <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-400 mb-4">Mode Maintenance</h3>
        <p className="text-gray-300 mb-4">
          Aktifkan mode maintenance untuk sementara menonaktifkan website dari akses publik.
        </p>
        
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.basic.maintenanceMode}
              onChange={(e) => handleInputChange('basic', 'maintenanceMode', e.target.checked)}
              className="w-5 h-5 text-yellow-500 bg-gray-700 border-gray-600 rounded focus:ring-yellow-500 focus:ring-2"
            />
            <span className="text-white font-medium">
              {settings.basic.maintenanceMode ? 'Mode Maintenance Aktif' : 'Mode Maintenance Nonaktif'}
            </span>
          </label>
        </div>

        {settings.basic.maintenanceMode && (
          <div className="mt-4 p-4 bg-red-800/30 rounded-lg">
            <p className="text-red-300 text-sm">
              ⚠️ Website saat ini dalam mode maintenance. Pengunjung akan melihat halaman maintenance.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderImageModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-6xl h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h3 className="text-xl font-semibold text-white">
            Pilih Gambar - {selectedImageType.split('.')[1]}
          </h3>
          <button
            onClick={() => setShowImageModal(false)}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>
        
        <div className="flex-1 p-6 overflow-hidden">
          <Masonry
            items={sampleImages}
            ease="power3.out"
            duration={0.6}
            stagger={0.05}
            animateFrom="bottom"
            scaleOnHover={true}
            hoverScale={0.95}
            blurToFocus={true}
            colorShiftOnHover={false}
          />
        </div>
        
        <div className="p-6 border-t border-gray-700">
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowImageModal(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={() => handleImageSelect('')}
              className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Gunakan URL Manual
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Pengaturan Website</h2>
        <button className="px-6 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-600 transition-colors">
          Simpan Semua
        </button>
      </div>

      {/* Section Navigation */}
      <div className="flex flex-wrap gap-2">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeSection === section.id
                ? 'bg-yellow-500 text-gray-900'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <span className="mr-2">{section.icon}</span>
            {section.title}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-gray-800/50 rounded-lg p-6">
        {activeSection === 'basic' && renderBasicSettings()}
        {activeSection === 'contact' && renderContactSettings()}
        {activeSection === 'branding' && renderBrandingSettings()}
        {activeSection === 'seo' && renderSEOSettings()}
        {activeSection === 'maintenance' && renderMaintenanceSettings()}
      </div>

      {/* Image Selection Modal */}
      {showImageModal && renderImageModal()}
    </div>
  );
}