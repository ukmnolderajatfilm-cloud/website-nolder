'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FilmAPI } from '../../../../lib/api/filmAPI';

export default function FilmManager() {
  const [films, setFilms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFilm, setEditingFilm] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title'); // 'title', 'date', 'status', 'rating'
  const [filterGenre, setFilterGenre] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list'
  const [formData, setFormData] = useState({
    film_title: '',
    description: '',
    film_genre: 'action',
    status: 'coming_soon',
    rating: 0,
    duration: '',
    director: '',
    release_date: '',
    poster_url: '',
    poster_path: '',
    trailer_url: ''
  });
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 15,
    total: 0,
    last_page: 1
  });
  
  const [meta, setMeta] = useState({ genres: [], directors: [], statuses: [] });


  // Fetch films
  const fetchFilms = useCallback(async (page = 1, newFilters = {}) => {
    try {
      setIsLoading(true);
      const params = {
        page,
        per_page: pagination.per_page,
        search: searchTerm,
        genre: filterGenre === 'all' ? '' : filterGenre,
        status: filterStatus === 'all' ? '' : filterStatus,
        sort_by: sortBy,
        sort_order: 'desc',
        ...newFilters
      };

      const response = await FilmAPI.getAll(params);
      
      if (response.meta.status === 'success') {
        setFilms(response.data.films);
        setPagination(response.data.pagination);
      } else {
      }
    } catch (error) {
      // Show user-friendly error message
      alert(`Error loading films: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, filterGenre, filterStatus, sortBy, pagination.per_page]);

  // Load metadata
  const loadMeta = useCallback(async () => {
    try {
      const response = await FilmAPI.getMeta();
      if (response.meta.status === 'success') {
        setMeta(response.data);
      }
    } catch (error) {
    }
  }, []);

  useEffect(() => {
    loadMeta();
    fetchFilms(1);
  }, [loadMeta, fetchFilms]);

  useEffect(() => {
    fetchFilms(1);
  }, [searchTerm, filterGenre, filterStatus, sortBy]);

  // Films are already filtered and sorted by API
  const filteredAndSortedFilms = films;

  const getGenreIcon = (genre) => {
    const icons = {
      action: '🎬',
      'sci-fi': '🚀',
      drama: '🎭',
      comedy: '😂',
      horror: '👻',
      romance: '💕',
      crime: '🔫',
      thriller: '😱'
    };
    return icons[genre] || '🎬';
  };

  const getGenreColor = (genre) => {
    const colors = {
      action: 'red',
      'sci-fi': 'blue',
      drama: 'purple',
      comedy: 'yellow',
      horror: 'gray',
      romance: 'pink',
      crime: 'orange',
      thriller: 'indigo'
    };
    return colors[genre] || 'gray';
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Only JPEG, PNG, and WebP images are allowed.');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('File size too large. Maximum size is 5MB.');
      return;
    }

    setSelectedFile(file);
    setUploading(true);

    try {
      const response = await FilmAPI.uploadPoster(file);
      if (response.meta.status === 'success') {
        const newFormData = {
          ...formData,
          poster_path: response.data.filePath
        };
        setFormData(newFormData);
        alert('Poster uploaded successfully!');
      } else {
        alert(response.meta.message);
      }
    } catch (error) {
      alert('Failed to upload poster');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (editingFilm) {
        response = await FilmAPI.update(editingFilm.id, formData);
      } else {
        response = await FilmAPI.create(formData);
      }

      if (response.meta.status === 'success') {
        alert(response.meta.message);
        setShowModal(false);
        setEditingFilm(null);
        setSelectedFile(null);
        setFormData({
          film_title: '',
          description: '',
          film_genre: 'action',
          status: 'coming_soon',
          rating: 0,
          duration: '',
          director: '',
          release_date: '',
          poster_url: '',
          poster_path: '',
          trailer_url: ''
        });
        fetchFilms(pagination.current_page);
      } else {
        alert(response.meta.message);
      }
    } catch (error) {
      alert('Failed to save film');
    }
  };

  const handleEdit = (film) => {
    setEditingFilm(film);
    setFormData({
      film_title: film.filmTitle || '',
      description: film.description || '',
      film_genre: film.filmGenre || '',
      status: film.status || '',
      rating: typeof film.rating === 'number' && !isNaN(film.rating) ? film.rating : 0,
      duration: film.duration ? `${film.duration} min` : '',
      director: film.director || '',
      release_date: film.releaseDate ? new Date(film.releaseDate).toISOString().split('T')[0] : '',
      poster_url: film.posterUrl || '',
      poster_path: film.posterPath || '',
      trailer_url: film.trailerUrl || ''
    });
    setSelectedFile(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Yakin ingin menghapus film ini?')) {
      try {
        const response = await FilmAPI.delete(id);
        if (response.meta.status === 'success') {
          alert(response.meta.message);
          fetchFilms(pagination.current_page);
        } else {
          alert(response.meta.message);
        }
      } catch (error) {
        alert('Failed to delete film');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-gray-600 border-t-yellow-400 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-blue-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
        </div>
        <div className="text-center">
          <p className="text-gray-300 font-medium">Memuat film...</p>
          <p className="text-gray-500 text-sm">Mohon tunggu sebentar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Manajemen Film</h2>
            <div className="flex items-center space-x-4 mt-2">
              <p className="text-gray-400">
                Kelola koleksi film yang akan ditampilkan di website
              </p>
              {(searchTerm || filterGenre !== 'all' || filterStatus !== 'all') && (
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">Filters:</span>
                  <div className="flex items-center space-x-1">
                    {searchTerm && (
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                        Search: "{searchTerm}"
                      </span>
                    )}
                    {filterGenre !== 'all' && (
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                        Genre: {filterGenre}
                      </span>
                    )}
                    {filterStatus !== 'all' && (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                        Status: {filterStatus}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-yellow-500 text-gray-900 rounded-xl hover:bg-yellow-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
          >
            + Tambah Film
          </button>
        </div>
      </div>

      {/* Modern Filters and Controls */}
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Cari film berdasarkan judul, sutradara, atau genre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all duration-200 backdrop-blur-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Genre Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-2">Genre</label>
            <div className="relative">
              <select
                value={filterGenre}
                onChange={(e) => setFilterGenre(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all duration-200 backdrop-blur-sm appearance-none cursor-pointer"
              >
                <option value="all">🎬 Semua Genre</option>
                {meta.genres && meta.genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {getGenreIcon(genre)} {genre}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all duration-200 backdrop-blur-sm appearance-none cursor-pointer"
              >
                <option value="all">📊 Semua Status</option>
                <option value="coming_soon">🔜 Coming Soon</option>
                <option value="now_showing">🎬 Now Showing</option>
                <option value="archived">📁 Archived</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Sort By */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-2">Urutkan</label>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all duration-200 backdrop-blur-sm appearance-none cursor-pointer"
              >
                <option value="title">📝 Judul</option>
                <option value="date">📅 Tanggal Rilis</option>
                <option value="rating">⭐ Rating</option>
                <option value="status">📊 Status</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* View Mode Toggle & Clear Filters */}
        <div className="flex items-center justify-between">
          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2 bg-gray-800/30 rounded-xl p-1 backdrop-blur-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                viewMode === 'grid' 
                  ? 'bg-yellow-500 text-gray-900 shadow-lg' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
              title="Grid View"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
              </svg>
              <span className="text-sm font-medium">Grid</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                viewMode === 'list' 
                  ? 'bg-yellow-500 text-gray-900 shadow-lg' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
              title="List View"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
              </svg>
              <span className="text-sm font-medium">List</span>
            </button>
          </div>

          {/* Clear Filters */}
          {(searchTerm || filterGenre !== 'all' || filterStatus !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterGenre('all');
                setFilterStatus('all');
                setSortBy('title');
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 rounded-lg transition-all duration-200 border border-red-500/30"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span className="text-sm font-medium">Clear Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      {filteredAndSortedFilms.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-gray-400">
            Menampilkan <span className="text-yellow-400 font-medium">{filteredAndSortedFilms.length}</span> dari <span className="text-yellow-400 font-medium">{pagination.total}</span> film
          </p>
          <div className="flex items-center space-x-2 text-gray-500 text-sm">
            <span>Halaman {pagination.current_page} dari {pagination.last_page}</span>
          </div>
        </div>
      )}

      {/* Films Display */}
      {filteredAndSortedFilms.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center shadow-lg">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">Tidak ada film ditemukan</h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            {searchTerm || filterGenre !== 'all' || filterStatus !== 'all' 
              ? 'Tidak ada film yang sesuai dengan filter yang Anda pilih. Coba ubah filter atau kata kunci pencarian.'
              : 'Belum ada film dalam database. Mulai dengan menambahkan film pertama Anda.'
            }
          </p>
          {(searchTerm || filterGenre !== 'all' || filterStatus !== 'all') ? (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterGenre('all');
                setFilterStatus('all');
                setSortBy('title');
              }}
              className="px-6 py-3 bg-yellow-500 text-gray-900 rounded-xl hover:bg-yellow-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
            >
              Reset Filter
            </button>
          ) : (
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-yellow-500 text-gray-900 rounded-xl hover:bg-yellow-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
            >
              + Tambah Film Pertama
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid gap-4 sm:mt-8 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredAndSortedFilms.map((film) => (
            <motion.div
              key={film.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative group"
            >
              <div className="absolute inset-px rounded-lg bg-white/5"></div>
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] bg-white/5 backdrop-blur-xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-200">
                {/* Card Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 bg-${getGenreColor(film.filmGenre)}-500/20 rounded-lg flex items-center justify-center`}>
                      <span className="text-lg">{getGenreIcon(film.filmGenre)}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-300 capitalize">
                      {film.filmGenre}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(film)}
                      className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(film.id)}
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

                {/* Poster */}
                <div className="w-full h-48 bg-gray-700 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                  {(film.posterPath || film.posterUrl) ? (
                    <img
                      src={film.posterPath || film.posterUrl}
                      alt={film.filmTitle}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="text-center">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v18a1 1 0 01-1 1H4a1 1 0 01-1-1V1a1 1 0 011-1h2a1 1 0 011 1v3m0 0H5a1 1 0 00-1 1v14a1 1 0 001 1h14a1 1 0 001-1V5a1 1 0 00-1-1h-2" />
                      </svg>
                      <p className="text-xs text-gray-400">No Poster</p>
                    </div>
                  )}
                </div>

                {/* Film Info */}
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white line-clamp-2 mb-1">
                      {film.filmTitle}
                    </h3>
                    <p className="text-sm text-gray-400 line-clamp-2">
                      {film.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                      <span className="text-yellow-400 font-medium">{film.rating}</span>
                    </div>
                    <span className="text-gray-400">{film.duration}</span>
                  </div>

                  <div className="text-sm text-gray-400">
                    <p className="line-clamp-1">Director: {film.director}</p>
                    <p className="line-clamp-1">Release: {new Date(film.releaseDate).getFullYear()}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      film.status === 'now_showing' 
                        ? 'bg-green-500/20 text-green-400' 
                        : film.status === 'coming_soon'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {film.status === 'now_showing' ? 'Now Showing' : 
                       film.status === 'coming_soon' ? 'Coming Soon' : 'Archived'}
                    </span>
                    <span className="text-xs text-gray-500">{film.lastUpdate}</span>
                  </div>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-white/15"></div>
            </motion.div>
          ))}
        </div>
      ) : (
        // List View
        <div className="space-y-4">
          {filteredAndSortedFilms.map((film) => (
            <motion.div
              key={film.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative group"
            >
              <div className="absolute inset-px rounded-lg bg-white/5"></div>
              <div className="relative flex items-center overflow-hidden rounded-[calc(var(--radius-lg)+1px)] bg-white/5 backdrop-blur-xl border border-white/10 p-4 hover:bg-white/10 transition-all duration-200">
                <div className="w-16 h-20 bg-gray-700 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {(film.posterPath || film.posterUrl) ? (
                    <img
                      src={film.posterPath || film.posterUrl}
                      alt={film.filmTitle}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v18a1 1 0 01-1 1H4a1 1 0 01-1-1V1a1 1 0 011-1h2a1 1 0 011 1v3m0 0H5a1 1 0 00-1 1v14a1 1 0 001 1h14a1 1 0 001-1V5a1 1 0 00-1-1h-2" />
                    </svg>
                  )}
                </div>

                <div className="flex-1 ml-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{film.filmTitle}</h3>
                      <p className="text-sm text-gray-400 line-clamp-1">{film.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                        <span className="text-yellow-400 font-medium">{film.rating}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        film.status === 'now_showing' 
                          ? 'bg-green-500/20 text-green-400' 
                          : film.status === 'coming_soon'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {film.status === 'now_showing' ? 'Now Showing' : 
                         film.status === 'coming_soon' ? 'Coming Soon' : 'Archived'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>{film.director}</span>
                      <span>{film.duration}</span>
                      <span>{new Date(film.releaseDate).getFullYear()}</span>
                    </div>
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(film)}
                        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(film.id)}
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
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-white/15"></div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Film Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-xl font-bold text-white mb-4">
              {editingFilm ? 'Edit Film' : 'Tambah Film Baru'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Judul Film
                  </label>
                  <input
                    type="text"
                    value={formData.film_title}
                    onChange={(e) => setFormData({...formData, film_title: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Masukkan judul film"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Genre
                  </label>
                  <select
                    value={formData.film_genre}
                    onChange={(e) => setFormData({...formData, film_genre: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    {meta.genres && meta.genres.map((genre) => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Rating
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={isNaN(formData.rating) ? '' : formData.rating}
                    onChange={(e) => {
                      const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                      setFormData({...formData, rating: isNaN(value) ? 0 : value});
                    }}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="0.0 - 10.0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Durasi
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Contoh: 120 min"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Sutradara
                  </label>
                  <input
                    type="text"
                    value={formData.director}
                    onChange={(e) => setFormData({...formData, director: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Nama sutradara"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tanggal Rilis
                  </label>
                  <input
                    type="date"
                    value={formData.release_date}
                    onChange={(e) => setFormData({...formData, release_date: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="coming_soon">Coming Soon</option>
                    <option value="now_showing">Now Showing</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Deskripsi
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Deskripsi film"
                />
              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Poster Film
                  </label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleFileChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-yellow-500 file:text-gray-900 hover:file:bg-yellow-600"
                      disabled={uploading}
                    />
                    {uploading && (
                      <div className="text-yellow-400 text-sm">Uploading...</div>
                    )}
                    {formData.poster_path && (
                      <div className="text-green-400 text-sm">✓ Poster uploaded successfully</div>
                    )}
                    <div className="text-gray-400 text-xs">
                      Supported formats: JPEG, PNG, WebP. Max size: 5MB
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    URL Trailer
                  </label>
                  <input
                    type="url"
                    value={formData.trailer_url}
                    onChange={(e) => setFormData({...formData, trailer_url: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="URL trailer (YouTube, dll)"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  {editingFilm ? 'Update Film' : 'Tambah Film'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingFilm(null);
                    setFormData({
                      film_title: '',
                      description: '',
                      film_genre: 'action',
                      status: 'coming_soon',
                      rating: 0,
                      duration: '',
                      director: '',
                      release_date: '',
                      poster_url: '',
                      poster_path: '',
                      trailer_url: ''
                    });
                    setSelectedFile(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Batal
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
