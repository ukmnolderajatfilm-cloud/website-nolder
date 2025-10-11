class FilmAPI {
  static baseURL = '/api/admin/films';

  // Helper method to handle API responses
  static async handleResponse(response) {
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.meta && errorData.meta.message) {
          errorMessage += ` - ${errorData.meta.message}`;
        }
      } catch (e) {
        // If we can't parse the error response, use the default message
      }
      throw new Error(errorMessage);
    }
    return await response.json();
  }

  // Get all films with filters and pagination
  static async getAll(params = {}) {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        queryParams.append(key, value);
      }
    });

    const url = `${this.baseURL}?${queryParams.toString()}`;
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return this.handleResponse(response);
  }

  // Get single film by ID
  static async getById(id, includeDeleted = false) {
    const queryParams = includeDeleted ? '?include_deleted=true' : '';
    const response = await fetch(`${this.baseURL}/${id}${queryParams}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return this.handleResponse(response);
  }

  // Create new film
  static async create(filmData) {
    const response = await fetch(this.baseURL, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filmData),
    });

    return this.handleResponse(response);
  }

  // Update existing film
  static async update(id, filmData) {
    const response = await fetch(`${this.baseURL}/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filmData),
    });

    return this.handleResponse(response);
  }

  // Delete film (soft delete)
  static async delete(id) {
    const response = await fetch(`${this.baseURL}/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return this.handleResponse(response);
  }

  // Restore soft-deleted film
  static async restore(id) {
    const response = await fetch(`${this.baseURL}/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'restore' }),
    });

    return this.handleResponse(response);
  }

  // Bulk operations
  static async bulkUpdateStatus(filmIds, status) {
    const response = await fetch(this.baseURL, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'bulk_status_update',
        filmIds,
        status,
      }),
    });

    return this.handleResponse(response);
  }

  static async bulkDelete(filmIds) {
    const response = await fetch(this.baseURL, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'bulk_delete',
        filmIds,
      }),
    });

    return this.handleResponse(response);
  }

  // Get film statistics
  static async getStats() {
    const response = await fetch(`${this.baseURL}/stats`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return this.handleResponse(response);
  }

  // Get film metadata (genres, directors, statuses)
  static async getMeta() {
    const response = await fetch(`${this.baseURL}/meta`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return this.handleResponse(response);
  }

  // Upload film poster
  static async uploadPoster(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseURL}/upload`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    return this.handleResponse(response);
  }

  // Export films to CSV/Excel (if implemented)
  static async export(format = 'csv', params = {}) {
    const queryParams = new URLSearchParams();
    queryParams.append('format', format);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        queryParams.append(key, value);
      }
    });

    const response = await fetch(`${this.baseURL}/export?${queryParams.toString()}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Handle file download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `films.${format}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}

export { FilmAPI };
