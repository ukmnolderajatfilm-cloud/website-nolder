import { prisma } from '../db.js'

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
    
    // Genres validation (array of genre IDs)
    if (!data.genres || !Array.isArray(data.genres) || data.genres.length === 0) {
      errors.genres = 'At least one genre is required'
    } else if (data.genres.length > 10) {
      errors.genres = 'Maximum 10 genres allowed'
    }
    
    
    // Duration validation
    if (!data.duration || (typeof data.duration === 'string' && data.duration.trim().length === 0)) {
      errors.duration = 'Duration is required'
    } else {
      // Extract number from duration string (e.g., "120 min" -> 120) or use number directly
      let durationValue
      if (typeof data.duration === 'number') {
        durationValue = data.duration
      } else {
        const durationMatch = data.duration.toString().match(/\d+/)
        durationValue = durationMatch ? parseInt(durationMatch[0]) : NaN
      }
      
      if (isNaN(durationValue) || durationValue < 1 || durationValue > 500) {
        errors.duration = 'Duration must be a number between 1 and 500 minutes'
      }
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
        { 
          filmGenres: {
            some: {
              genre: {
                judulGenre: { contains: search }
              }
            }
          }
        }
      ]
    }

    // Genre filter
    if (genre) {
      where.filmGenres = {
        some: {
          genre: {
            judulGenre: { contains: genre }
          }
        }
      }
    }

    // Status filter
    if (status) {
      where.status = status
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
      orderBy.filmTitle = sortOrder // Fallback to title since we can't sort by multiple genres easily
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
            },
            filmGenres: {
              include: {
                genre: {
                  select: {
                    id: true,
                    judulGenre: true
                  }
                }
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
          },
          filmGenres: {
            include: {
              genre: {
                select: {
                  id: true,
                  judulGenre: true
                }
              }
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

    // Validate genre IDs exist
    const genreIds = data.genres.map(id => parseInt(id))
    const existingGenres = await prisma.genre.findMany({
      where: { id: { in: genreIds } }
    })

    if (existingGenres.length !== genreIds.length) {
      throw new Error('One or more genre IDs are invalid')
    }

    try {
      // Extract duration number from string (e.g., "120 min" -> 120) or use number directly
      let durationValue
      if (typeof data.duration === 'number') {
        durationValue = data.duration
      } else {
        const durationMatch = data.duration.toString().match(/\d+/)
        durationValue = durationMatch ? parseInt(durationMatch[0]) : 0
      }

      const film = await prisma.film.create({
        data: {
          filmTitle: data.film_title.trim(),
          duration: durationValue,
          director: data.director.trim(),
          releaseDate: new Date(data.release_date),
          status: data.status,
          description: data.description?.trim() || null,
          posterUrl: data.poster_url?.trim() || null,
          posterPath: data.poster_path?.trim() || null,
          trailerUrl: data.trailer_url?.trim() || null,
          adminId: parseInt(adminId),
          filmGenres: {
            create: genreIds.map(genreId => ({
              genreId: genreId
            }))
          }
        },
        include: {
          admin: {
            select: {
              id: true,
              username: true,
              name: true
            }
          },
          filmGenres: {
            include: {
              genre: {
                select: {
                  id: true,
                  judulGenre: true
                }
              }
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

    // Validate genre IDs exist
    const genreIds = data.genres.map(id => parseInt(id))
    const existingGenres = await prisma.genre.findMany({
      where: { id: { in: genreIds } }
    })

    if (existingGenres.length !== genreIds.length) {
      throw new Error('One or more genre IDs are invalid')
    }

    try {
      // Extract duration number from string (e.g., "120 min" -> 120) or use number directly
      let durationValue
      if (typeof data.duration === 'number') {
        durationValue = data.duration
      } else {
        const durationMatch = data.duration.toString().match(/\d+/)
        durationValue = durationMatch ? parseInt(durationMatch[0]) : 0
      }

      // Use transaction to update film and genres
      const film = await prisma.$transaction(async (tx) => {
        // Update film data
        const updatedFilm = await tx.film.update({
          where: { id: parseInt(id) },
          data: {
            filmTitle: data.film_title.trim(),
            duration: durationValue,
            director: data.director.trim(),
            releaseDate: new Date(data.release_date),
            status: data.status,
            description: data.description?.trim() || null,
            posterUrl: data.poster_url?.trim() || null,
            posterPath: data.poster_path?.trim() || null,
            trailerUrl: data.trailer_url?.trim() || null
          }
        })

        // Delete existing film-genre relationships
        await tx.filmGenre.deleteMany({
          where: { filmId: parseInt(id) }
        })

        // Create new film-genre relationships
        await tx.filmGenre.createMany({
          data: genreIds.map(genreId => ({
            filmId: parseInt(id),
            genreId: genreId
          }))
        })

        // Return film with updated relationships
        return await tx.film.findUnique({
          where: { id: parseInt(id) },
          include: {
            admin: {
              select: {
                id: true,
                username: true,
                name: true
              }
            },
            filmGenres: {
              include: {
                genre: {
                  select: {
                    id: true,
                    judulGenre: true
                  }
                }
              }
            }
          }
        })
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
      console.log(`FilmService: Attempting to soft delete film ${id} by admin ${adminId}`)
      
      // First check if film exists and is not already deleted
      const existingFilm = await prisma.film.findFirst({
        where: { 
          id: parseInt(id),
          deletedAt: null
        }
      })

      if (!existingFilm) {
        console.log(`FilmService: Film ${id} not found or already deleted`)
        throw new Error('Film not found')
      }

      console.log(`FilmService: Found film ${id} - ${existingFilm.filmTitle}, proceeding with soft delete`)

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

      console.log(`FilmService: Successfully soft deleted film ${id} - ${film.filmTitle}`)
      return film
    } catch (error) {
      console.error(`FilmService: Failed to delete film ${id}:`, error)
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
      ] = await Promise.all([
        prisma.film.count({ where: { deletedAt: null } }),
        prisma.film.count({ where: { deletedAt: null, status: 'now_showing' } }),
        prisma.film.count({ where: { deletedAt: null, status: 'coming_soon' } }),
        prisma.film.count({ where: { deletedAt: null, status: 'now_showing' } }),
        prisma.film.count({ where: { deletedAt: null, status: 'archived' } })
      ])

      return {
        total: totalFilms,
        byStatus: {
          coming_soon: comingSoonFilms,
          now_showing: nowShowingFilms,
          archived: archivedFilms
        }
      }
    } catch (error) {
      throw new Error(`Failed to get film statistics: ${error.message}`)
    }
  }

  // Get all genres
  static async getAllGenres() {
    try {
      const genres = await prisma.genre.findMany({
        orderBy: { judulGenre: 'asc' }
      })
      return genres
    } catch (error) {
      throw new Error(`Failed to get genres: ${error.message}`)
    }
  }

  // Create new genre
  static async createGenre(judulGenre) {
    try {
      // Check if genre already exists
      const existingGenre = await prisma.genre.findFirst({
        where: { judulGenre: judulGenre.trim() }
      })

      if (existingGenre) {
        throw new Error('Genre already exists')
      }

      const genre = await prisma.genre.create({
        data: { judulGenre: judulGenre.trim() }
      })

      return genre
    } catch (error) {
      if (error.code === 'P2002') {
        throw new Error('Genre already exists')
      }
      throw new Error(`Failed to create genre: ${error.message}`)
    }
  }

  // Update genre
  static async updateGenre(id, judulGenre) {
    try {
      // Check if genre exists
      const existingGenre = await prisma.genre.findUnique({
        where: { id: parseInt(id) }
      })

      if (!existingGenre) {
        throw new Error('Genre not found')
      }

      // Check if new name already exists
      const duplicateGenre = await prisma.genre.findFirst({
        where: { 
          judulGenre: judulGenre.trim(),
          id: { not: parseInt(id) }
        }
      })

      if (duplicateGenre) {
        throw new Error('Genre name already exists')
      }

      const genre = await prisma.genre.update({
        where: { id: parseInt(id) },
        data: { judulGenre: judulGenre.trim() }
      })

      return genre
    } catch (error) {
      if (error.code === 'P2002') {
        throw new Error('Genre name already exists')
      }
      throw new Error(`Failed to update genre: ${error.message}`)
    }
  }

  // Delete genre
  static async deleteGenre(id) {
    try {
      // Check if genre is being used by any films
      const filmCount = await prisma.filmGenre.count({
        where: { genreId: parseInt(id) }
      })

      if (filmCount > 0) {
        throw new Error('Cannot delete genre that is being used by films')
      }

      await prisma.genre.delete({
        where: { id: parseInt(id) }
      })

      return { success: true }
    } catch (error) {
      throw new Error(`Failed to delete genre: ${error.message}`)
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
