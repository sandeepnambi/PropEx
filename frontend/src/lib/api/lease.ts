const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const leaseApi = {
  async getAll(filters: any = {}) {
    const params = new URLSearchParams(filters).toString();
    const res = await fetch(`${API_URL}/leases?${params}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return res.json();
  },

  async getById(id: string) {
    const res = await fetch(`${API_URL}/leases/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return res.json();
  },

  async create(data: any) {
    const res = await fetch(`${API_URL}/leases`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async update(id: string, data: any) {
    const res = await fetch(`${API_URL}/leases/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },
};

export const documentApi = {
  async upload(formData: FormData) {
    const res = await fetch(`${API_URL}/documents/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });
    return res.json();
  },

  async getByLeaseId(leaseId: string) {
    const res = await fetch(`${API_URL}/documents/${leaseId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return res.json();
  },

  async delete(id: string) {
    const res = await fetch(`${API_URL}/documents/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (res.status === 204) return { status: 'success' };
    return res.json();
  },
};
