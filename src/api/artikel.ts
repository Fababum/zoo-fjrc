// ==================== TYPES ====================

export interface Artikel {
  id: number;
  markdownText: string;
  userId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface CreateArtikelDto {
  markdownText: string;
  userId: number;
}

export interface UpdateArtikelDto {
  markdownText?: string;
  isActive?: boolean;
}

// ==================== API FUNCTIONS ====================

const API_URL = 'http://localhost:3000/artikel';

// Alle Artikel holen
export const getAllArtikel = async (): Promise<Artikel[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch articles');
  }
  return response.json();
};

// Einzelnen Artikel holen
export const getArtikelById = async (id: number): Promise<Artikel> => {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch article');
  }
  return response.json();
};

// Artikel erstellen
export const createArtikel = async (data: CreateArtikelDto): Promise<Artikel> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create article');
  }
  return response.json();
};

// Artikel aktualisieren
export const updateArtikel = async (id: number, data: UpdateArtikelDto): Promise<Artikel> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update article');
  }
  return response.json();
};

// Artikel löschen
export const deleteArtikel = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete article');
  }
};
