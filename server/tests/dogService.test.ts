import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getRandomDogImage } from '../services/dogService';

describe('dogService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return dog image data when API call succeeds', async () => {
    const mockApiResponse = {
      message: 'https://images.dog.ceo/breeds/terrier-welsh/lucy.jpg',
      status: 'success'
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse
    });

    global.fetch = mockFetch;

    const result = await getRandomDogImage();

    

    expect(result.imageUrl).toBe(mockApiResponse.message);
    expect(result.status).toBe('success');
    expect(mockFetch).toHaveBeenCalledOnce();
  });

  it('should throw error when API returns status 500', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500
    });

    global.fetch = mockFetch;

    await expect(getRandomDogImage()).rejects.toThrow(
      'Failed to fetch dog image: Dog API returned status 500'
    );
  });
});
