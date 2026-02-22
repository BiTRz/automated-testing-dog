import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';

vi.mock('../controllers/dogController', () => ({
  getDogImage: vi.fn()
}));

describe('dogRoutes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 200 with success true and mocked dog image data', async () => {
    const mockResponseData = {
      success: true,
      data: {
        imageUrl: 'https://images.dog.ceo/breeds/stbernard/n02109525_15579.jpg',
        status: 'success'
      }
    };

    const { getDogImage } = await import('../controllers/dogController');
    vi.mocked(getDogImage).mockImplementation((_req, res) => {
      res.status(200).json(mockResponseData);
      return Promise.resolve();
    });

    const dogRoutes = (await import('../routes/dogRoutes')).default;

    const app = express();
    app.use('/api/dogs', dogRoutes);

    const response = await request(app).get('/api/dogs/random');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.imageUrl).toContain('https://images.dog.ceo/breeds/stbernard/n02109525_15579.jpg');
  });
});