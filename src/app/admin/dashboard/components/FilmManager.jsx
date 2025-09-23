'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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
    title: '',
    description: '',
    genre: 'action',
    status: 'active',
    rating: 0,
    duration: '',
    director: '',
    cast: '',
    releaseDate: '',
    poster: '',
    trailer: ''
  });

  // Sample data - replace with API call
  const sampleFilms = [
    { 
      id: 1, 
      title: "The Dark Knight", 
      description: "Batman faces the Joker in this epic superhero film", 
      genre: "action", 
      status: "active", 
      rating: 9.0, 
      duration: "152 min", 
      director: "Christopher Nolan", 
      cast: "Christian Bale, Heath Ledger", 
      releaseDate: "2008-07-18", 
      poster: "", 
      trailer: "",
      lastUpdate: "2 jam lalu"
    },
    { 
      id: 2, 
      title: "Inception", 
      description: "A mind-bending thriller about dreams within dreams", 
      genre: "sci-fi", 
      status: "active", 
      rating: 8.8, 
      duration: "148 min", 
      director: "Christopher Nolan", 
      cast: "Leonardo DiCaprio, Marion Cotillard", 
      releaseDate: "2010-07-16", 
      poster: "", 
      trailer: "",
      lastUpdate: "1 hari lalu"
    },
    { 
      id: 3, 
      title: "Interstellar", 
      description: "A team of explorers travel through a wormhole in space", 
      genre: "sci-fi", 
      status: "active", 
      rating: 8.6, 
      duration: "169 min", 
      director: "Christopher Nolan", 
      cast: "Matthew McConaughey, Anne Hathaway", 
      releaseDate: "2014-11-07", 
      poster: "", 
      trailer: "",
      lastUpdate: "3 jam lalu"
    },
    { 
      id: 4, 
      title: "The Matrix", 
      description: "A computer hacker learns about the true nature of reality", 
      genre: "sci-fi", 
      status: "active", 
      rating: 8.7, 
      duration: "136 min", 
      director: "The Wachowskis", 
      cast: "Keanu Reeves, Laurence Fishburne", 
      releaseDate: "1999-03-31", 
      poster: "", 
      trailer: "",
      lastUpdate: "5 jam lalu"
    },
    { 
      id: 5, 
      title: "Pulp Fiction", 
      description: "The lives of two mob hitmen, a boxer, and a diner intertwine", 
      genre: "crime", 
      status: "inactive", 
      rating: 8.9, 
      duration: "154 min", 
      director: "Quentin Tarantino", 
      cast: "John Travolta, Samuel L. Jackson", 
      releaseDate: "1994-10-14", 
      poster: "", 
      trailer: "",
      lastUpdate: "1 minggu lalu"
    },
    { 
      id: 6, 
      title: "The Godfather", 
      description: "The aging patriarch of a crime family transfers control to his son", 
      genre: "crime", 
      status: "active", 
      rating: 9.2, 
      duration: "175 min", 
      director: "Francis Ford Coppola", 
      cast: "Marlon Brando, Al Pacino", 
      releaseDate: "1972-03-24", 
      poster: "", 
      trailer: "",
      lastUpdate: "2 hari lalu"
    }
  ];

  // Fetch films
  const fetchFilms = async () => {
    try {
      // Simulate API call
      setTimeout(() => {
        setFilms(sampleFilms);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching films:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFilms();
  }, []);

  // Filter and sort films
  const filteredAndSortedFilms = films
    .filter(film => {
      const searchMatch = film.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         film.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         film.director.toLowerCase().includes(searchTerm.toLowerCase());
      const genreMatch = filterGenre === 'all' || film.genre === filterGenre;
      const statusMatch = filterStatus === 'all' || film.status === filterStatus;
      return searchMatch && genreMatch && statusMatch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'date':
          return new Date(b.releaseDate) - new Date(a.releaseDate);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Simulate API call
      const newFilm = {
        id: editingFilm ? editingFilm.id : Date.now(),
        ...formData,
        lastUpdate: 'Baru saja'
      };

      if (editingFilm) {
        setFilms(films.map(film => 
          film.id === editingFilm.id ? newFilm : film
        ));
      } else {
        setFilms([...films, newFilm]);
      }

      setShowModal(false);
      setEditingFilm(null);
      setFormData({
        title: '',
        description: '',
        genre: 'action',
        status: 'active',
        rating: 0,
        duration: '',
        director: '',
        cast: '',
        releaseDate: '',
        poster: '',
        trailer: ''
      });
    } catch (error) {
      console.error('Error saving film:', error);
    }
  };

  const handleEdit = (film) => {
    setEditingFilm(film);
    setFormData({
      title: film.title,
      description: film.description || '',
      genre: film.genre,
      status: film.status,
      rating: film.rating,
      duration: film.duration || '',
      director: film.director || '',
      cast: film.cast || '',
      releaseDate: film.releaseDate || '',
      poster: film.poster || '',
      trailer: film.trailer || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Yakin ingin menghapus film ini?')) {
      try {
        setFilms(films.filter(film => film.id !== id));
      } catch (error) {
        console.error('Error deleting film:', error);
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
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Manajemen Film</h2>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Tambah Film
          </button>
        </div>
        <p className="text-gray-400">
          Kelola koleksi film yang akan ditampilkan di website
        </p>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Cari film..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' 
                ? 'bg-yellow-500 text-gray-900' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            title="Grid View"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list' 
                ? 'bg-yellow-500 text-gray-900' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            title="List View"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
            </svg>
          </button>
        </div>

        {/* Sort By */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
        >
          <option value="title">Urutkan: Judul</option>
          <option value="date">Urutkan: Tanggal Rilis</option>
          <option value="rating">Urutkan: Rating</option>
          <option value="status">Urutkan: Status</option>
        </select>

        {/* Genre Filter */}
        <select
          value={filterGenre}
          onChange={(e) => setFilterGenre(e.target.value)}
          className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
        >
          <option value="all">Semua Genre</option>
          <option value="action">Action</option>
          <option value="sci-fi">Sci-Fi</option>
          <option value="drama">Drama</option>
          <option value="comedy">Comedy</option>
          <option value="horror">Horror</option>
          <option value="romance">Romance</option>
          <option value="crime">Crime</option>
          <option value="thriller">Thriller</option>
        </select>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
        >
          <option value="all">Semua Status</option>
          <option value="active">Aktif</option>
          <option value="inactive">Tidak Aktif</option>
        </select>
      </div>

      {/* Films Display */}
      {filteredAndSortedFilms.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v18a1 1 0 01-1 1H4a1 1 0 01-1-1V1a1 1 0 011-1h2a1 1 0 011 1v3m0 0H5a1 1 0 00-1 1v14a1 1 0 001 1h14a1 1 0 001-1V5a1 1 0 00-1-1h-2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Tidak ada film</h3>
          <p className="text-gray-400">Belum ada film yang sesuai dengan filter yang dipilih.</p>
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
                    <div className={`w-8 h-8 bg-${getGenreColor(film.genre)}-500/20 rounded-lg flex items-center justify-center`}>
                      <span className="text-lg">{getGenreIcon(film.genre)}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-300 capitalize">
                      {film.genre}
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
                  {film.poster ? (
                    <img
                      src={film.poster}
                      alt={film.title}
                      className="w-full h-full object-cover"
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
                      {film.title}
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
                      film.status === 'active' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {film.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
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
                  {film.poster ? (
                    <img
                      src={film.poster}
                      alt={film.title}
                      className="w-full h-full object-cover"
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
                      <h3 className="text-lg font-semibold text-white">{film.title}</h3>
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
                        film.status === 'active' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {film.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
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
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
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
                    value={formData.genre}
                    onChange={(e) => setFormData({...formData, genre: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="action">Action</option>
                    <option value="sci-fi">Sci-Fi</option>
                    <option value="drama">Drama</option>
                    <option value="comedy">Comedy</option>
                    <option value="horror">Horror</option>
                    <option value="romance">Romance</option>
                    <option value="crime">Crime</option>
                    <option value="thriller">Thriller</option>
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
                    value={formData.rating}
                    onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value)})}
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
                    value={formData.releaseDate}
                    onChange={(e) => setFormData({...formData, releaseDate: e.target.value})}
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
                    <option value="active">Aktif</option>
                    <option value="inactive">Tidak Aktif</option>
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

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Pemeran
                </label>
                <input
                  type="text"
                  value={formData.cast}
                  onChange={(e) => setFormData({...formData, cast: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Nama pemeran (pisahkan dengan koma)"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    URL Poster
                  </label>
                  <input
                    type="url"
                    value={formData.poster}
                    onChange={(e) => setFormData({...formData, poster: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="URL gambar poster"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    URL Trailer
                  </label>
                  <input
                    type="url"
                    value={formData.trailer}
                    onChange={(e) => setFormData({...formData, trailer: e.target.value})}
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
                      title: '',
                      description: '',
                      genre: 'action',
                      status: 'active',
                      rating: 0,
                      duration: '',
                      director: '',
                      cast: '',
                      releaseDate: '',
                      poster: '',
                      trailer: ''
                    });
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
