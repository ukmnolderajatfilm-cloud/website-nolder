import { prisma } from '../db'

export class FilmService {
  // Validation rules
  static validateFilmData(data, isUpdate = false) {
    const errors = {}
    
    // Film title validation
    if (!data.film_title || data.film_title.trim().length === 0) {
      errors.film_title = 'Film title is required'
    } else if (data.film_title.length > 255) {
      errors.film_title = 'Film title must be less than 255 characters'
    }
    
    // Genre validation
    if (!data.film_genre || data.film_genre.trim().length === 0) {
      errors.film_genre = 'Film genre is required'
    } else if (data.film_genre.length > 100) {
      errors.film_genre = 'Film genre must be less than 100 characters'
    }
    
    // Rating validation
    if (data.rating === undefined || data.rating === null) {
      errors.rating = 'Rating is required'
    } else if (isNaN(data.rating) || data.rating < 0 || data.rating > 10) {
      errors.rating = 'Rating must be a number between 0 and 10'
    }
    
    // Duration validation
    if (!data.duration || isNaN(data.duration) || data.duration < 1 || data.duration > 500) {
      errors.duration = 'Duration must be a number between 1 and 500 minutes'
    }
    
    // Director validation
    if (!data.director || data.director.trim().length === 0) {
      errors.director = 'Director is required'
    } else if (data.director.length > 255) {
      errors.director = 'Director name must be less than 255 characters'
    }
    
    // Release date validation
    if (!data.release_date) {
      errors.release_date = 'Release date is required'
    } else {
      const releaseDate = new Date(data.release_date)
      if (isNaN(releaseDate.getTime())) {
        errors.release_date = 'Invalid release date format'
      }
    }
    
    // Status validation
    const validStatuses = ['coming_soon', 'now_showing', 'archived']
    if (!data.status || !validStatuses.includes(data.status)) {
      errors.status = `Status must be one of: ${validStatuses.join(', ')}`
    }
    
    // Description validation (optional but with max length)
    if (data.description && data.description.length > 2000) {
      errors.description = 'Description must be less than 2000 characters'
    }
    
    // URL validations (optional)
    if (data.poster_url && data.poster_url.length > 500) {
      errors.poster_url = 'Poster URL must be less than 500 characters'
    }

    // Poster Path validation (for file upload)
    if (data.poster_path && data.poster_path.length > 500) {
      errors.poster_path = 'Poster path must be less than 500 characters'
    }
    
    if (data.trailer_url && data.trailer_url.length > 500) {
      errors.trailer_url = 'Trailer URL must be less than 500 characters'
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }

  // Get all films with pagination, search, and filters
  static async getAllFilms(options = {}) {
    const {
      page = 1,
      perPage = 15,
      search = '',
      genre = '',
      status = '',
      ratingMin = '',
      ratingMax = '',
      year = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      includeDeleted = false
    } = options

    const skip = (page - 1) * perPage
    const where = {}

    // Soft delete filter
    if (!includeDeleted) {
      where.deletedAt = null
    }

    // Search filter
    if (search) {
      where.OR = [
        { filmTitle: { contains: search } },
        { director: { contains: search } },
        { filmGenre: { contains: search } }
      ]
    }

    // Genre filter
    if (genre) {
      where.filmGenre = { contains: genre }
    }

    // Status filter
    if (status) {
      where.status = status
    }

    // Rating range filter
    if (ratingMin !== '' || ratingMax !== '') {
      where.rating = {}
      if (ratingMin !== '') {
        where.rating.gte = parseFloat(ratingMin)
      }
      if (ratingMax !== '') {
        where.rating.lte = parseFloat(ratingMax)
      }
    }

    // Year filter
    if (year) {
      const startDate = new Date(`${year}-01-01`)
      const endDate = new Date(`${year}-12-31`)
      where.releaseDate = {
        gte: startDate,
        lte: endDate
      }
    }

    // Build orderBy
    const orderBy = {}
    if (sortBy === 'title') {
      orderBy.filmTitle = sortOrder
    } else if (sortBy === 'genre') {
      orderBy.filmGenre = sortOrder
    } else if (sortBy === 'rating') {
      orderBy.rating = sortOrder
    } else if (sortBy === 'date') {
      orderBy.releaseDate = sortOrder
    } else if (sortBy === 'status') {
      orderBy.status = sortOrder
    } else if (sortBy === 'filmTitle') {
      orderBy.filmTitle = sortOrder
    } else if (sortBy === 'releaseDate') {
      orderBy.releaseDate = sortOrder
    } else {
      orderBy.createdAt = sortOrder
    }

    try {
      const [films, total] = await Promise.all([
        prisma.film.findMany({
          where,
          skip,
          take: perPage,
          orderBy,
          include: {
            admin: {
              select: {
                id: true,
                username: true,
                name: true
              }
            }
          }
        }),
        prisma.film.count({ where })
      ])

      const totalPages = Math.ceil(total / perPage)

      return {
        films,
        pagination: {
          current_page: page,
          per_page: perPage,
          total,
          last_page: totalPages,
          has_more: page < totalPages
        }
      }
    } catch (error) {
      throw new Error(`Failed to fetch films: ${error.message}`)
    }
  }

  // Get single film by ID
  static async getFilmById(id, includeDeleted = false) {
    const where = { id: parseInt(id) }
    
    if (!includeDeleted) {
      where.deletedAt = null
    }

    try {
      const film = await prisma.film.findFirst({
        where,
        include: {
          admin: {
            select: {
              id: true,
              username: true,
              name: true
            }
          }
        }
      })

      if (!film) {
        throw new Error('Film not found')
      }

      return film
    } catch (error) {
      throw new Error(`Failed to fetch film: ${error.message}`)
    }
  }

  // Create new film
  static async createFilm(data, adminId) {
    const validation = this.validateFilmData(data)
    
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${JSON.stringify(validation.errors)}`)
    }

    // Check for duplicate title
    const existingFilm = await prisma.film.findFirst({
      where: {
        filmTitle: data.film_title,
        deletedAt: null
      }
    })

    if (existingFilm) {
      throw new Error('A film with this title already exists')
    }

    try {
      const film = await prisma.film.create({
        data: {
          filmTitle: data.film_title.trim(),
          filmGenre: data.film_genre.trim(),
          rating: parseFloat(data.rating),
          duration: parseInt(data.duration),
          director: data.director.trim(),
          releaseDate: new Date(data.release_date),
          status: data.status,
          description: data.description?.trim() || null,
          posterUrl: data.poster_url?.trim() || null,
          posterPath: data.poster_path?.trim() || null,
          trailerUrl: data.trailer_url?.trim() || null,
          adminId: parseInt(adminId)
        },
        include: {
          admin: {
            select: {
              id: true,
              username: true,
              name: true
            }
          }
        }
      })

      return film
    } catch (error) {
      if (error.code === 'P2002') {
        throw new Error('A film with this title already exists')
      }
      throw new Error(`Failed to create film: ${error.message}`)
    }
  }

  // Update existing film
  static async updateFilm(id, data, adminId) {
    const validation = this.validateFilmData(data, true)
    
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${JSON.stringify(validation.errors)}`)
    }

    // Check if film exists
    const existingFilm = await this.getFilmById(id)
    
    // Check for duplicate title (excluding current film)
    const duplicateFilm = await prisma.film.findFirst({
      where: {
        filmTitle: data.film_title,
        id: { not: parseInt(id) },
        deletedAt: null
      }
    })

    if (duplicateFilm) {
      throw new Error('A film with this title already exists')
    }

    try {
      const film = await prisma.film.update({
        where: { id: parseInt(id) },
        data: {
          filmTitle: data.film_title.trim(),
          filmGenre: data.film_genre.trim(),
          rating: parseFloat(data.rating),
          duration: parseInt(data.duration),
          director: data.director.trim(),
          releaseDate: new Date(data.release_date),
          status: data.status,
          description: data.description?.trim() || null,
          posterUrl: data.poster_url?.trim() || null,
          posterPath: data.poster_path?.trim() || null,
          trailerUrl: data.trailer_url?.trim() || null
        },
        include: {
          admin: {
            select: {
              id: true,
              username: true,
              name: true
            }
          }
        }
      })

      return film
    } catch (error) {
      if (error.code === 'P2002') {
        throw new Error('A film with this title already exists')
      }
      throw new Error(`Failed to update film: ${error.message}`)
    }
  }

  // Soft delete film
  static async deleteFilm(id, adminId) {
    try {
      const film = await prisma.film.update({
        where: { id: parseInt(id) },
        data: { deletedAt: new Date() },
        include: {
          admin: {
            select: {
              id: true,
              username: true,
              name: true
            }
          }
        }
      })

      return film
    } catch (error) {
      throw new Error(`Failed to delete film: ${error.message}`)
    }
  }

  // Restore soft-deleted film
  static async restoreFilm(id, adminId) {
    try {
      const film = await prisma.film.update({
        where: { id: parseInt(id) },
        data: { deletedAt: null },
        include: {
          admin: {
            select: {
              id: true,
              username: true,
              name: true
            }
          }
        }
      })

      return film
    } catch (error) {
      throw new Error(`Failed to restore film: ${error.message}`)
    }
  }

  // Bulk operations
  static async bulkUpdateStatus(filmIds, status, adminId) {
    const validStatuses = ['coming_soon', 'now_showing', 'archived']
    
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`)
    }

    try {
      const result = await prisma.film.updateMany({
        where: {
          id: { in: filmIds.map(id => parseInt(id)) },
          deletedAt: null
        },
        data: { status }
      })

      return { updatedCount: result.count }
    } catch (error) {
      throw new Error(`Failed to bulk update films: ${error.message}`)
    }
  }

  static async bulkDelete(filmIds, adminId) {
    try {
      const result = await prisma.film.updateMany({
        where: {
          id: { in: filmIds.map(id => parseInt(id)) },
          deletedAt: null
        },
        data: { deletedAt: new Date() }
      })

      return { deletedCount: result.count }
    } catch (error) {
      throw new Error(`Failed to bulk delete films: ${error.message}`)
    }
  }

  // Get film statistics
  static async getFilmStats() {
    try {
      const [
        totalFilms,
        activeFilms,
        comingSoonFilms,
        nowShowingFilms,
        archivedFilms,
        avgRating
      ] = await Promise.all([
        prisma.film.count({ where: { deletedAt: null } }),
        prisma.film.count({ where: { deletedAt: null, status: 'now_showing' } }),
        prisma.film.count({ where: { deletedAt: null, status: 'coming_soon' } }),
        prisma.film.count({ where: { deletedAt: null, status: 'now_showing' } }),
        prisma.film.count({ where: { deletedAt: null, status: 'archived' } }),
        prisma.film.aggregate({
          where: { deletedAt: null },
          _avg: { rating: true }
        })
      ])

      return {
        total: totalFilms,
        byStatus: {
          coming_soon: comingSoonFilms,
          now_showing: nowShowingFilms,
          archived: archivedFilms
        },
        averageRating: avgRating._avg.rating || 0
      }
    } catch (error) {
      throw new Error(`Failed to get film statistics: ${error.message}`)
    }
  }

  // Get unique genres
  static async getUniqueGenres() {
    try {
      const films = await prisma.film.findMany({
        where: { deletedAt: null },
        select: { filmGenre: true }
      })

      const genres = new Set()
      films.forEach(film => {
        const filmGenres = film.filmGenre.split(',').map(g => g.trim())
        filmGenres.forEach(genre => {
          if (genre) genres.add(genre)
        })
      })

      return Array.from(genres).sort()
    } catch (error) {
      throw new Error(`Failed to get genres: ${error.message}`)
    }
  }

  // Get unique directors
  static async getUniqueDirectors() {
    try {
      const films = await prisma.film.findMany({
        where: { deletedAt: null },
        select: { director: true }
      })

      const directors = new Set(films.map(film => film.director))
      return Array.from(directors).sort()
    } catch (error) {
      throw new Error(`Failed to get directors: ${error.message}`)
    }
  }
}
