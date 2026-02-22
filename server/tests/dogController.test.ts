import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getDogImage } from '../controllers/dogController';
import * as dogService from '../services/dogService';
import { Request, Response } from 'express';

describe('dogController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return success true with mocked dog service data', async () => {
    const mockServiceResponse = {
        imageUrl: 'https://images.dog.ceo/breeds/terrier-welsh/lucy.jpg',
        status: 'success'
    };

    vi.spyOn(dogService, 'getRandomDogImage').mockResolvedValue(mockServiceResponse);

    const mockRequest = {} as Request;
    const mockResponse = {
        json: vi.fn().mockReturnThis(),
        status: vi.fn().mockReturnThis()
    } as unknown as Response;

    await getDogImage(mockRequest, mockResponse);

    expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockServiceResponse
    });
    });
  });
  