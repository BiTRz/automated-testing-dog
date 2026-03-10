import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';

vi.mock('../controllers/dogController', () => ({
  getDogImage: vi.fn()
}));

describe('dogApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 500 with error when controller fails', async () => {
    const mockErrorResponse = {
      success: false,
      error: 'Failed to fetch dog image: Network error'
    };

    const { getDogImage } = await import('../controllers/dogController');
    vi.mocked(getDogImage).mockImplementation((_req, res) => {
      res.status(500).json(mockErrorResponse);
      return Promise.resolve();
    });

    const dogRoutes = (await import('../routes/dogRoutes')).default;

    const app = express();
    app.use('/api/dog', dogRoutes);

    const response = await request(app).get('/api/dog/random');

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Failed to fetch dog image: Network error');
  });

  it('should return 200 with success true and data from /api/dog/random', async () => {
    const mockSuccessResponse = {
      success: true,
      data: {
        imageUrl: 'https://images.dog.ceo/breeds/sheepdog.indian/Himalayan_Sheepdog.jpg',
        status: 'success'
      }
    };

    const { getDogImage } = await import('../controllers/dogController');
    vi.mocked(getDogImage).mockImplementation((_req, res) => {
      res.status(200).json(mockSuccessResponse);
      return Promise.resolve();
    });

    const dogRoutes = (await import('../routes/dogRoutes')).default;

    const app = express();
    app.use('/api/dog', dogRoutes);

    const response = await request(app).get('/api/dog/random');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(response.body.data).toHaveProperty('imageUrl');
    expect(typeof response.body.data.imageUrl).toBe('string');
  });

  it('should return 404 and An unexpected error occurred', async () => {
    const dogRoutes = (await import('../routes/dogRoutes')).default;

    const app = express();
    app.use('/api/dog', dogRoutes);

    const response = await request(app).get('/api/dog/invalid');

    expect(response.status).toBe(404);
    
    expect(response.text).toContain('Cannot GET /api/dog/invalid');
  });
});