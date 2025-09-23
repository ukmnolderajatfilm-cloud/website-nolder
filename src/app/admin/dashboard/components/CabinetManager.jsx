    'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CabinetManager() {
  const [cabinets, setCabinets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCabinet, setEditingCabinet] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name'); // 'name', 'date', 'status'
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'inactive'
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active',
    category: 'film'
  });

  const [cabinetContent, setCabinetContent] = useState({
    name: 'Kabinet Cineverso',
    description: 'Deskripsi kabinet yang akan ditampilkan di website',
    ketua: {
      name: 'John Doe',
      position: 'Ketua',
      image: '',
      description: 'Deskripsi ketua kabinet'
    },
    wakilKetua: {
      name: 'Jane Smith',
      position: 'Wakil Ketua',
      image: '',
      description: 'Deskripsi wakil ketua kabinet'
    },
    // Divisi ANF (3 orang)
    anf: {
      ketua: { name: '', position: 'Ketua ANF', image: '', description: '' },
      wakilKetua: { name: '', position: 'Wakil Ketua ANF', image: '', description: '' },
      sekretaris: { name: '', position: 'Sekretaris ANF', image: '', description: '' },
      newPosition: 'ketua',
      newName: '',
      newDescription: '',
      newImage: ''
    },
    // Divisi PSDI (3 orang)
    psdi: {
      ketua: { name: '', position: 'Ketua PSDI', image: '', description: '' },
      wakilKetua: { name: '', position: 'Wakil Ketua PSDI', image: '', description: '' },
      sekretaris: { name: '', position: 'Sekretaris PSDI', image: '', description: '' },
      newPosition: 'ketua',
      newName: '',
      newDescription: '',
      newImage: ''
    },
    // Divisi PSDM (3 orang)
    psdm: {
      ketua: { name: '', position: 'Ketua PSDM', image: '', description: '' },
      wakilKetua: { name: '', position: 'Wakil Ketua PSDM', image: '', description: '' },
      sekretaris: { name: '', position: 'Sekretaris PSDM', image: '', description: '' },
      newPosition: 'ketua',
      newName: '',
      newDescription: '',
      newImage: ''
    },
    // Divisi Produksi (3 orang)
    produksi: {
      ketua: { name: '', position: 'Ketua Produksi', image: '', description: '' },
      wakilKetua: { name: '', position: 'Wakil Ketua Produksi', image: '', description: '' },
      sekretaris: { name: '', position: 'Sekretaris Produksi', image: '', description: '' },
      newPosition: 'ketua',
      newName: '',
      newDescription: '',
      newImage: ''
    },
    // Divisi HUMI (4 orang)
    humi: {
      ketua: { name: '', position: 'Ketua HUMI', image: '', description: '' },
      wakilKetua: { name: '', position: 'Wakil Ketua HUMI', image: '', description: '' },
      sekretaris: { name: '', position: 'Sekretaris HUMI', image: '', description: '' },
      bendahara: { name: '', position: 'Bendahara HUMI', image: '', description: '' },
      newPosition: 'ketua',
      newName: '',
      newDescription: '',
      newImage: ''
    },
    // Divisi DEA (3 orang)
    dea: {
      ketua: { name: '', position: 'Ketua DEA', image: '', description: '' },
      wakilKetua: { name: '', position: 'Wakil Ketua DEA', image: '', description: '' },
      sekretaris: { name: '', position: 'Sekretaris DEA', image: '', description: '' },
      newPosition: 'ketua',
      newName: '',
      newDescription: '',
      newImage: ''
    }
  });

  const [editingMember, setEditingMember] = useState(null);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [tempName, setTempName] = useState('');

  // Sample data - replace with API call
  const sampleCabinets = [
    { id: 1, name: "Kabinet Film Drama", status: "active", items: 24, lastUpdate: "2 jam lalu", description: "Koleksi film drama terbaik", category: "film" },
    { id: 2, name: "Kabinet Film Action", status: "active", items: 18, lastUpdate: "1 hari lalu", description: "Film action dengan aksi menegangkan", category: "film" },
    { id: 3, name: "Kabinet Film Comedy", status: "inactive", items: 12, lastUpdate: "3 hari lalu", description: "Film komedi untuk hiburan", category: "film" },
    { id: 4, name: "Kabinet Film Horror", status: "active", items: 8, lastUpdate: "5 jam lalu", description: "Film horor yang menyeramkan", category: "film" },
    { id: 5, name: "Kabinet Film Sci-Fi", status: "active", items: 15, lastUpdate: "1 jam lalu", description: "Film science fiction futuristik", category: "film" },
    { id: 6, name: "Kabinet Film Romance", status: "inactive", items: 6, lastUpdate: "1 minggu lalu", description: "Film romantis untuk pasangan", category: "film" }
  ];

  // Fetch cabinets
  const fetchCabinets = async () => {
    try {
      // Simulate API call
      setTimeout(() => {
        setCabinets(sampleCabinets);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching cabinets:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCabinets();
  }, []);

  // Filter and sort cabinets
  const filteredAndSortedCabinets = cabinets
    .filter(cabinet => {
      const searchMatch = cabinet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cabinet.description.toLowerCase().includes(searchTerm.toLowerCase());
      const statusMatch = filterStatus === 'all' || cabinet.status === filterStatus;
      return searchMatch && statusMatch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return new Date(b.lastUpdate) - new Date(a.lastUpdate);
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Simulate API call
      const newCabinet = {
        id: editingCabinet ? editingCabinet.id : Date.now(),
        ...formData,
        items: 0,
        lastUpdate: 'Baru saja'
      };

      if (editingCabinet) {
        setCabinets(cabinets.map(cabinet => 
          cabinet.id === editingCabinet.id ? newCabinet : cabinet
        ));
      } else {
        setCabinets([...cabinets, newCabinet]);
      }

      setShowModal(false);
      setEditingCabinet(null);
      setFormData({
        name: '',
        description: '',
        status: 'active',
        category: 'film'
      });
    } catch (error) {
      console.error('Error saving cabinet:', error);
    }
  };

  const handleEdit = (cabinet) => {
    setEditingCabinet(cabinet);
    setFormData({
      name: cabinet.name,
      description: cabinet.description || '',
      status: cabinet.status,
      category: cabinet.category || 'film'
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Yakin ingin menghapus kabinet ini?')) {
      try {
        setCabinets(cabinets.filter(cabinet => cabinet.id !== id));
      } catch (error) {
        console.error('Error deleting cabinet:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section - Nama Kabinet */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <h1 className="text-4xl font-bold text-white">{cabinetContent.name}</h1>
        <button
          onClick={() => {
            setTempName(cabinetContent.name);
            setShowNameModal(true);
          }}
          className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-600 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
          </svg>
          Edit Nama
        </button>
      </motion.div>

      {/* Section Ketua dan Wakil Ketua */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-6"
      >
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Ketua dan Wakil Ketua</h2>
          <hr className="border-gray-600 mb-6" />
        </div>

        {/* Grid Container untuk Ketua dan Wakil Ketua */}
        <div className="grid gap-4 sm:mt-8 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2">
          {/* Ketua Card */}
          <motion.div
            key="ketua"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative group"
          >
            <div className="absolute inset-px rounded-lg bg-white/5"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] bg-white/5 backdrop-blur-xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-200">
              {/* Card Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-300">
                    Ketua
                  </span>
                </div>
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setEditingMember('ketua');
                      setShowMemberModal(true);
                    }}
                    className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Yakin ingin menghapus data ketua?')) {
                        setCabinetContent({
                          ...cabinetContent,
                          ketua: { name: '', position: 'Ketua', image: '', description: '' }
                        });
                      }
                    }}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                    title="Hapus"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd"/>
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Card Content - Centered */}
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                {/* Jabatan */}
                <h3 className="text-lg font-semibold text-white">Ketua Kabinet</h3>
                
                {/* Foto */}
                <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                  {cabinetContent.ketua.image ? (
                    <img
                      src={cabinetContent.ketua.image}
                      alt="Ketua"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
                
                {/* Nama */}
                <h4 className="text-xl font-bold text-white">
                  {cabinetContent.ketua.name || 'Belum ada ketua'}
                </h4>
                
                {/* Deskripsi */}
                <p className="text-gray-400 text-sm line-clamp-3">
                  {cabinetContent.ketua.description || 'Deskripsi ketua kabinet akan ditampilkan di sini'}
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-white/15"></div>
          </motion.div>

          {/* Wakil Ketua Card */}
          <motion.div
            key="wakilKetua"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative group"
          >
            <div className="absolute inset-px rounded-lg bg-white/5"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] bg-white/5 backdrop-blur-xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-200">
              {/* Card Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-300">
                    Wakil Ketua
                  </span>
                </div>
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setEditingMember('wakilKetua');
                      setShowMemberModal(true);
                    }}
                    className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Yakin ingin menghapus data wakil ketua?')) {
                        setCabinetContent({
                          ...cabinetContent,
                          wakilKetua: { name: '', position: 'Wakil Ketua', image: '', description: '' }
                        });
                      }
                    }}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                    title="Hapus"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd"/>
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Card Content - Centered */}
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                {/* Jabatan */}
                <h3 className="text-lg font-semibold text-white">Wakil Ketua Kabinet</h3>
                
                {/* Foto */}
                <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                  {cabinetContent.wakilKetua.image ? (
                    <img
                      src={cabinetContent.wakilKetua.image}
                      alt="Wakil Ketua"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
                
                {/* Nama */}
                <h4 className="text-xl font-bold text-white">
                  {cabinetContent.wakilKetua.name || 'Belum ada wakil ketua'}
                </h4>
                
                {/* Deskripsi */}
                <p className="text-gray-400 text-sm line-clamp-3">
                  {cabinetContent.wakilKetua.description || 'Deskripsi wakil ketua kabinet akan ditampilkan di sini'}
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-white/15"></div>
          </motion.div>
        </div>
      </motion.div>

      {/* Section Divisi ANF */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-6"
      >
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Divisi ANF</h2>
            <hr className="border-gray-600" />
          </div>
          <button
            onClick={() => {
              setEditingMember('anf.new');
              setShowMemberModal(true);
            }}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
            </svg>
            Tambah
          </button>
        </div>

        <div className="grid gap-4 sm:mt-8 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3">
          {[
            { key: 'ketua', title: 'Ketua ANF', color: 'purple' },
            { key: 'wakilKetua', title: 'Wakil Ketua ANF', color: 'indigo' },
            { key: 'sekretaris', title: 'Sekretaris ANF', color: 'blue' }
          ].map((member, index) => (
            <motion.div
              key={member.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + (index * 0.1) }}
              className="relative group"
            >
              <div className="absolute inset-px rounded-lg bg-white/5"></div>
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] bg-white/5 backdrop-blur-xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 bg-${member.color}-500/20 rounded-lg flex items-center justify-center`}>
                      <svg className={`w-4 h-4 text-${member.color}-400`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-300">
                      {member.title}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditingMember(`anf.${member.key}`);
                        setShowMemberModal(true);
                      }}
                      className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Yakin ingin menghapus data ${member.title}?`)) {
                          setCabinetContent({
                            ...cabinetContent,
                            anf: {
                              ...cabinetContent.anf,
                              [member.key]: { name: '', position: member.title, image: '', description: '' }
                            }
                          });
                        }
                      }}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                      title="Hapus"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd"/>
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                  <h3 className="text-lg font-semibold text-white">{member.title}</h3>
                  
                  <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                    {cabinetContent.anf[member.key].image ? (
                      <img
                        src={cabinetContent.anf[member.key].image}
                        alt={member.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                  </div>
                  
                  <h4 className="text-xl font-bold text-white">
                    {cabinetContent.anf[member.key].name || `Belum ada ${member.title.toLowerCase()}`}
                  </h4>
                  
                  <p className="text-gray-400 text-sm line-clamp-3">
                    {cabinetContent.anf[member.key].description || `Deskripsi ${member.title.toLowerCase()} akan ditampilkan di sini`}
                  </p>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-white/15"></div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Section Divisi PSDI */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="space-y-6"
      >
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Divisi PSDI</h2>
            <hr className="border-gray-600" />
          </div>
          <button
            onClick={() => {
              setEditingMember('psdi.new');
              setShowMemberModal(true);
            }}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
            </svg>
            Tambah
          </button>
        </div>

        <div className="grid gap-4 sm:mt-8 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3">
          {[
            { key: 'ketua', title: 'Ketua PSDI', color: 'emerald' },
            { key: 'wakilKetua', title: 'Wakil Ketua PSDI', color: 'teal' },
            { key: 'sekretaris', title: 'Sekretaris PSDI', color: 'cyan' }
          ].map((member, index) => (
            <motion.div
              key={member.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + (index * 0.1) }}
              className="relative group"
            >
              <div className="absolute inset-px rounded-lg bg-white/5"></div>
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] bg-white/5 backdrop-blur-xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 bg-${member.color}-500/20 rounded-lg flex items-center justify-center`}>
                      <svg className={`w-4 h-4 text-${member.color}-400`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-300">
                      {member.title}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditingMember(`psdi.${member.key}`);
                        setShowMemberModal(true);
                      }}
                      className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Yakin ingin menghapus data ${member.title}?`)) {
                          setCabinetContent({
                            ...cabinetContent,
                            psdi: {
                              ...cabinetContent.psdi,
                              [member.key]: { name: '', position: member.title, image: '', description: '' }
                            }
                          });
                        }
                      }}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                      title="Hapus"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd"/>
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                  <h3 className="text-lg font-semibold text-white">{member.title}</h3>
                  
                  <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                    {cabinetContent.psdi[member.key].image ? (
                      <img
                        src={cabinetContent.psdi[member.key].image}
                        alt={member.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                  </div>
                  
                  <h4 className="text-xl font-bold text-white">
                    {cabinetContent.psdi[member.key].name || `Belum ada ${member.title.toLowerCase()}`}
                  </h4>
                  
                  <p className="text-gray-400 text-sm line-clamp-3">
                    {cabinetContent.psdi[member.key].description || `Deskripsi ${member.title.toLowerCase()} akan ditampilkan di sini`}
                  </p>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-white/15"></div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Section Divisi PSDM */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="space-y-6"
      >
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Divisi PSDM</h2>
            <hr className="border-gray-600" />
          </div>
          <button
            onClick={() => {
              setEditingMember('psdm.new');
              setShowMemberModal(true);
            }}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
            </svg>
            Tambah
          </button>
        </div>

        <div className="grid gap-4 sm:mt-8 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3">
          {[
            { key: 'ketua', title: 'Ketua PSDM', color: 'orange' },
            { key: 'wakilKetua', title: 'Wakil Ketua PSDM', color: 'amber' },
            { key: 'sekretaris', title: 'Sekretaris PSDM', color: 'yellow' }
          ].map((member, index) => (
            <motion.div
              key={member.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 + (index * 0.1) }}
              className="relative group"
            >
              <div className="absolute inset-px rounded-lg bg-white/5"></div>
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] bg-white/5 backdrop-blur-xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 bg-${member.color}-500/20 rounded-lg flex items-center justify-center`}>
                      <svg className={`w-4 h-4 text-${member.color}-400`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-300">
                      {member.title}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditingMember(`psdm.${member.key}`);
                        setShowMemberModal(true);
                      }}
                      className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Yakin ingin menghapus data ${member.title}?`)) {
                          setCabinetContent({
                            ...cabinetContent,
                            psdm: {
                              ...cabinetContent.psdm,
                              [member.key]: { name: '', position: member.title, image: '', description: '' }
                            }
                          });
                        }
                      }}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                      title="Hapus"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd"/>
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                  <h3 className="text-lg font-semibold text-white">{member.title}</h3>
                  
                  <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                    {cabinetContent.psdm[member.key].image ? (
                      <img
                        src={cabinetContent.psdm[member.key].image}
                        alt={member.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                  </div>
                  
                  <h4 className="text-xl font-bold text-white">
                    {cabinetContent.psdm[member.key].name || `Belum ada ${member.title.toLowerCase()}`}
                  </h4>
                  
                  <p className="text-gray-400 text-sm line-clamp-3">
                    {cabinetContent.psdm[member.key].description || `Deskripsi ${member.title.toLowerCase()} akan ditampilkan di sini`}
                  </p>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-white/15"></div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Section Divisi Produksi */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6 }}
        className="space-y-6"
      >
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Divisi Produksi</h2>
            <hr className="border-gray-600" />
          </div>
          <button
            onClick={() => {
              setEditingMember('produksi.new');
              setShowMemberModal(true);
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
            </svg>
            Tambah
          </button>
        </div>

        <div className="grid gap-4 sm:mt-8 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3">
          {[
            { key: 'ketua', title: 'Ketua Produksi', color: 'red' },
            { key: 'wakilKetua', title: 'Wakil Ketua Produksi', color: 'pink' },
            { key: 'sekretaris', title: 'Sekretaris Produksi', color: 'rose' }
          ].map((member, index) => (
            <motion.div
              key={member.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7 + (index * 0.1) }}
              className="relative group"
            >
              <div className="absolute inset-px rounded-lg bg-white/5"></div>
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] bg-white/5 backdrop-blur-xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 bg-${member.color}-500/20 rounded-lg flex items-center justify-center`}>
                      <svg className={`w-4 h-4 text-${member.color}-400`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-300">
                      {member.title}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditingMember(`produksi.${member.key}`);
                        setShowMemberModal(true);
                      }}
                      className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Yakin ingin menghapus data ${member.title}?`)) {
                          setCabinetContent({
                            ...cabinetContent,
                            produksi: {
                              ...cabinetContent.produksi,
                              [member.key]: { name: '', position: member.title, image: '', description: '' }
                            }
                          });
                        }
                      }}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                      title="Hapus"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd"/>
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                  <h3 className="text-lg font-semibold text-white">{member.title}</h3>
                  
                  <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                    {cabinetContent.produksi[member.key].image ? (
                      <img
                        src={cabinetContent.produksi[member.key].image}
                        alt={member.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                  </div>
                  
                  <h4 className="text-xl font-bold text-white">
                    {cabinetContent.produksi[member.key].name || `Belum ada ${member.title.toLowerCase()}`}
                  </h4>
                  
                  <p className="text-gray-400 text-sm line-clamp-3">
                    {cabinetContent.produksi[member.key].description || `Deskripsi ${member.title.toLowerCase()} akan ditampilkan di sini`}
                  </p>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-white/15"></div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Section Divisi HUMI */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.0 }}
        className="space-y-6"
      >
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Divisi HUMI</h2>
            <hr className="border-gray-600" />
          </div>
          <button
            onClick={() => {
              setEditingMember('humi.new');
              setShowMemberModal(true);
            }}
            className="px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
            </svg>
            Tambah
          </button>
        </div>

        <div className="grid gap-4 sm:mt-8 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4">
          {[
            { key: 'ketua', title: 'Ketua HUMI', color: 'violet' },
            { key: 'wakilKetua', title: 'Wakil Ketua HUMI', color: 'purple' },
            { key: 'sekretaris', title: 'Sekretaris HUMI', color: 'fuchsia' },
            { key: 'bendahara', title: 'Bendahara HUMI', color: 'indigo' }
          ].map((member, index) => (
            <motion.div
              key={member.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.1 + (index * 0.1) }}
              className="relative group"
            >
              <div className="absolute inset-px rounded-lg bg-white/5"></div>
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] bg-white/5 backdrop-blur-xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 bg-${member.color}-500/20 rounded-lg flex items-center justify-center`}>
                      <svg className={`w-4 h-4 text-${member.color}-400`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-300">
                      {member.title}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditingMember(`humi.${member.key}`);
                        setShowMemberModal(true);
                      }}
                      className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Yakin ingin menghapus data ${member.title}?`)) {
                          setCabinetContent({
                            ...cabinetContent,
                            humi: {
                              ...cabinetContent.humi,
                              [member.key]: { name: '', position: member.title, image: '', description: '' }
                            }
                          });
                        }
                      }}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                      title="Hapus"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd"/>
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                  <h3 className="text-lg font-semibold text-white">{member.title}</h3>
                  
                  <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                    {cabinetContent.humi[member.key].image ? (
                      <img
                        src={cabinetContent.humi[member.key].image}
                        alt={member.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                  </div>
                  
                  <h4 className="text-xl font-bold text-white">
                    {cabinetContent.humi[member.key].name || `Belum ada ${member.title.toLowerCase()}`}
                  </h4>
                  
                  <p className="text-gray-400 text-sm line-clamp-3">
                    {cabinetContent.humi[member.key].description || `Deskripsi ${member.title.toLowerCase()} akan ditampilkan di sini`}
                  </p>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-white/15"></div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Section Divisi DEA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5 }}
        className="space-y-6"
      >
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Divisi DEA</h2>
            <hr className="border-gray-600" />
          </div>
          <button
            onClick={() => {
              setEditingMember('dea.new');
              setShowMemberModal(true);
            }}
            className="px-4 py-2 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
            </svg>
            Tambah
          </button>
        </div>

        <div className="grid gap-4 sm:mt-8 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3">
          {[
            { key: 'ketua', title: 'Ketua DEA', color: 'lime' },
            { key: 'wakilKetua', title: 'Wakil Ketua DEA', color: 'green' },
            { key: 'sekretaris', title: 'Sekretaris DEA', color: 'emerald' }
          ].map((member, index) => (
            <motion.div
              key={member.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.6 + (index * 0.1) }}
              className="relative group"
            >
              <div className="absolute inset-px rounded-lg bg-white/5"></div>
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] bg-white/5 backdrop-blur-xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 bg-${member.color}-500/20 rounded-lg flex items-center justify-center`}>
                      <svg className={`w-4 h-4 text-${member.color}-400`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-300">
                      {member.title}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditingMember(`dea.${member.key}`);
                        setShowMemberModal(true);
                      }}
                      className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Yakin ingin menghapus data ${member.title}?`)) {
                          setCabinetContent({
                            ...cabinetContent,
                            dea: {
                              ...cabinetContent.dea,
                              [member.key]: { name: '', position: member.title, image: '', description: '' }
                            }
                          });
                        }
                      }}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                      title="Hapus"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd"/>
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                  <h3 className="text-lg font-semibold text-white">{member.title}</h3>
                  
                  <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                    {cabinetContent.dea[member.key].image ? (
                      <img
                        src={cabinetContent.dea[member.key].image}
                        alt={member.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                  </div>
                  
                  <h4 className="text-xl font-bold text-white">
                    {cabinetContent.dea[member.key].name || `Belum ada ${member.title.toLowerCase()}`}
                  </h4>
                  
                  <p className="text-gray-400 text-sm line-clamp-3">
                    {cabinetContent.dea[member.key].description || `Deskripsi ${member.title.toLowerCase()} akan ditampilkan di sini`}
                  </p>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-white/15"></div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Modal Edit Nama Kabinet */}
      {showNameModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-bold text-white mb-4">Edit Nama Kabinet</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nama Kabinet
              </label>
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Masukkan nama kabinet"
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setCabinetContent({...cabinetContent, name: tempName});
                  setShowNameModal(false);
                }}
                className="flex-1 px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-600 transition-colors"
              >
                Simpan
              </button>
              <button
                onClick={() => setShowNameModal(false)}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Batal
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal Edit Member */}
      {showMemberModal && editingMember && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-bold text-white mb-4">
              {editingMember.includes('.new') ? 'Tambah Anggota Baru' : 'Edit ' + (() => {
                const [division, role] = editingMember.split('.');
                return cabinetContent[division][role].position;
              })()}
            </h3>
            
            <div className="space-y-4">
              {editingMember.includes('.new') && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Posisi/Jabatan
                  </label>
                  <select
                    value={(() => {
                      const [division] = editingMember.split('.');
                      return cabinetContent[division].newPosition || 'ketua';
                    })()}
                    onChange={(e) => {
                      const [division] = editingMember.split('.');
                      setCabinetContent({
                        ...cabinetContent,
                        [division]: {
                          ...cabinetContent[division],
                          newPosition: e.target.value
                        }
                      });
                    }}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="ketua">Ketua</option>
                    <option value="wakilKetua">Wakil Ketua</option>
                    <option value="sekretaris">Sekretaris</option>
                    <option value="bendahara">Bendahara</option>
                  </select>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nama
                </label>
                <input
                  type="text"
                  value={(() => {
                    const [division, role] = editingMember.split('.');
                    if (editingMember.includes('.new')) {
                      return cabinetContent[division].newName || '';
                    }
                    return cabinetContent[division][role].name;
                  })()}
                  onChange={(e) => {
                    const [division, role] = editingMember.split('.');
                    if (editingMember.includes('.new')) {
                      setCabinetContent({
                        ...cabinetContent,
                        [division]: {
                          ...cabinetContent[division],
                          newName: e.target.value
                        }
                      });
                    } else {
                      setCabinetContent({
                        ...cabinetContent,
                        [division]: {
                          ...cabinetContent[division],
                          [role]: {...cabinetContent[division][role], name: e.target.value}
                        }
                      });
                    }
                  }}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Masukkan nama"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Deskripsi
                </label>
                <textarea
                  value={(() => {
                    const [division, role] = editingMember.split('.');
                    if (editingMember.includes('.new')) {
                      return cabinetContent[division].newDescription || '';
                    }
                    return cabinetContent[division][role].description;
                  })()}
                  onChange={(e) => {
                    const [division, role] = editingMember.split('.');
                    if (editingMember.includes('.new')) {
                      setCabinetContent({
                        ...cabinetContent,
                        [division]: {
                          ...cabinetContent[division],
                          newDescription: e.target.value
                        }
                      });
                    } else {
                      setCabinetContent({
                        ...cabinetContent,
                        [division]: {
                          ...cabinetContent[division],
                          [role]: {...cabinetContent[division][role], description: e.target.value}
                        }
                      });
                    }
                  }}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Masukkan deskripsi"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Foto
                </label>
                <div className="flex items-center space-x-4">
                  {(() => {
                    const [division, role] = editingMember.split('.');
                    if (editingMember.includes('.new')) {
                      return cabinetContent[division].newImage;
                    }
                    return cabinetContent[division][role].image;
                  })() ? (
                    <div className="relative">
                      <img
                        src={(() => {
                          const [division, role] = editingMember.split('.');
                          if (editingMember.includes('.new')) {
                            return cabinetContent[division].newImage;
                          }
                          return cabinetContent[division][role].image;
                        })()}
                        alt={editingMember}
                        className="w-16 h-16 object-cover rounded-lg border border-gray-600"
                      />
                      <button
                        onClick={() => {
                          const [division, role] = editingMember.split('.');
                          if (editingMember.includes('.new')) {
                            setCabinetContent({
                              ...cabinetContent,
                              [division]: {
                                ...cabinetContent[division],
                                newImage: ''
                              }
                            });
                          } else {
                            setCabinetContent({
                              ...cabinetContent,
                              [division]: {
                                ...cabinetContent[division],
                                [role]: {...cabinetContent[division][role], image: ''}
                              }
                            });
                          }
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-gray-700 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            const [division, role] = editingMember.split('.');
                            if (editingMember.includes('.new')) {
                              setCabinetContent({
                                ...cabinetContent,
                                [division]: {
                                  ...cabinetContent[division],
                                  newImage: e.target.result
                                }
                              });
                            } else {
                              setCabinetContent({
                                ...cabinetContent,
                                [division]: {
                                  ...cabinetContent[division],
                                  [role]: {...cabinetContent[division][role], image: e.target.result}
                                }
                              });
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                      id={`image-${editingMember}`}
                    />
                    <label
                      htmlFor={`image-${editingMember}`}
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm hover:bg-gray-600 cursor-pointer inline-block"
                    >
                      Pilih Foto
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  if (editingMember.includes('.new')) {
                    // Handle adding new member
                    const [division] = editingMember.split('.');
                    const newPosition = cabinetContent[division].newPosition || 'ketua';
                    const newName = cabinetContent[division].newName || '';
                    const newDescription = cabinetContent[division].newDescription || '';
                    const newImage = cabinetContent[division].newImage || '';
                    
                    if (newName.trim()) {
                      setCabinetContent({
                        ...cabinetContent,
                        [division]: {
                          ...cabinetContent[division],
                          [newPosition]: {
                            name: newName,
                            position: `${newPosition.charAt(0).toUpperCase() + newPosition.slice(1)} ${division.toUpperCase()}`,
                            image: newImage,
                            description: newDescription
                          },
                          newPosition: 'ketua',
                          newName: '',
                          newDescription: '',
                          newImage: ''
                        }
                      });
                    }
                  }
                  setShowMemberModal(false);
                  setEditingMember(null);
                }}
                className="flex-1 px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-600 transition-colors"
              >
                {editingMember.includes('.new') ? 'Tambah' : 'Simpan'}
              </button>
              <button
                onClick={() => {
                  setShowMemberModal(false);
                  setEditingMember(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Batal
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
