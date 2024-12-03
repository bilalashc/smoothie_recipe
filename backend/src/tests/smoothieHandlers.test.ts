import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { createSmoothie, deleteSmoothie, getAllSmoothies, getSmoothieById, updateSmoothie } from '../routes/smoothieHandlers';

// Create a mock PrismaClient
const mockPrismaClient = {
  smoothie: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  smoothieIngredient: {
    deleteMany: jest.fn(),
  },
  smoothieTag: {
    deleteMany: jest.fn(),
  },
} as unknown as PrismaClient;

// Mock the entire PrismaClient module
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrismaClient)
}));

describe('Smoothie Handlers', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let prisma: jest.Mocked<typeof mockPrismaClient>;

  beforeEach(() => {
    req = {
      params: {},
      body: {}
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    prisma = mockPrismaClient as jest.Mocked<typeof mockPrismaClient>;
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('getAllSmoothies', () => {
    it('should return all smoothies', async () => {
      const mockSmoothies = [
        { 
          id: '1', 
          name: 'Berry Blast',
          ingredients: [],
          tags: [] 
        }
      ];
      
      (prisma.smoothie.findMany as jest.Mock).mockResolvedValue(mockSmoothies);

      const handler = getAllSmoothies(prisma);
      await handler(req as Request, res as Response);

      expect(prisma.smoothie.findMany).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(mockSmoothies);
    });

    it('should handle errors when fetching fails', async () => {
      (prisma.smoothie.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

      const handler = getAllSmoothies(prisma);
      await handler(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch smoothies' });
    });
  });

  describe('getSmoothieById', () => {
    it('should return a smoothie when found', async () => {
      const mockSmoothie = { 
        id: '1', 
        name: 'Berry Blast',
        ingredients: [],
        tags: [] 
      };
      req.params = { id: '1' };
      (prisma.smoothie.findUnique as jest.Mock).mockResolvedValue(mockSmoothie);

      const handler = getSmoothieById(prisma);
      await handler(req as Request, res as Response);

      expect(prisma.smoothie.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          ingredients: { include: { ingredient: true } },
          tags: { include: { tag: true } },
        },
      });
      expect(res.json).toHaveBeenCalledWith(mockSmoothie);
    });

    it('should return 404 when smoothie not found', async () => {
      req.params = { id: 'non-existent-id' };
      (prisma.smoothie.findUnique as jest.Mock).mockResolvedValue(null);

      const handler = getSmoothieById(prisma);
      await handler(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Smoothie not found' });
    });

    it('should handle errors when fetching fails', async () => {
      req.params = { id: '1' };
      (prisma.smoothie.findUnique as jest.Mock).mockRejectedValue(new Error('Database error'));

      const handler = getSmoothieById(prisma);
      await handler(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch individual smoothie' });
    });
  });

  describe('createSmoothie', () => {
    const newSmoothieData = {
      name: 'Tropical Paradise',
      ingredients: [
        { name: 'Mango', quantity: 100, unit: 'g' },
        { name: 'Pineapple', quantity: 100, unit: 'g' }
      ],
      tags: ['tropical', 'sweet']
    };

    const createdSmoothie = {
      id: '1',
      name: 'Tropical Paradise',
      ingredients: [
        { 
          ingredient: { name: 'Mango' },
          quantity: 100,
          unit: 'g'
        },
        {
          ingredient: { name: 'Pineapple' },
          quantity: 100,
          unit: 'g'
        }
      ],
      tags: [
        { tag: { name: 'tropical' } },
        { tag: { name: 'sweet' } }
      ]
    };

    it('should create a new smoothie successfully', async () => {
      req.body = newSmoothieData;
      (prisma.smoothie.create as jest.Mock).mockResolvedValue(createdSmoothie);

      const handler = createSmoothie(prisma);
      await handler(req as Request, res as Response);

      expect(prisma.smoothie.create).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdSmoothie);
    });

    it('should handle creation errors', async () => {
      req.body = newSmoothieData;
      (prisma.smoothie.create as jest.Mock).mockRejectedValue(new Error('Database error'));

      const handler = createSmoothie(prisma);
      await handler(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to create smoothie' });
    });
  });

  describe('updateSmoothie', () => {
    const updateData = {
      name: 'Updated Smoothie',
      ingredients: [
        { name: 'Banana', quantity: 150, unit: 'g' }
      ],
      tags: ['creamy']
    };

    const updatedSmoothie = {
      id: '1',
      ...updateData,
      ingredients: [
        { 
          ingredient: { name: 'Banana' },
          quantity: 150,
          unit: 'g'
        }
      ],
      tags: [
        { tag: { name: 'creamy' } }
      ]
    };

    it('should update a smoothie successfully', async () => {
      req.params = { id: '1' };
      req.body = updateData;
      
      (prisma.smoothieIngredient.deleteMany as jest.Mock).mockResolvedValue({});
      (prisma.smoothieTag.deleteMany as jest.Mock).mockResolvedValue({});
      (prisma.smoothie.update as jest.Mock).mockResolvedValue(updatedSmoothie);

      const handler = updateSmoothie(prisma);
      await handler(req as Request, res as Response);

      expect(prisma.smoothieIngredient.deleteMany).toHaveBeenCalledWith({
        where: { smoothieId: '1' }
      });
      expect(prisma.smoothieTag.deleteMany).toHaveBeenCalledWith({
        where: { smoothieId: '1' }
      });
      expect(prisma.smoothie.update).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedSmoothie);
    });

    it('should handle update errors when deleting ingredients fails', async () => {
      req.params = { id: '1' };
      req.body = updateData;
      
      (prisma.smoothieIngredient.deleteMany as jest.Mock).mockRejectedValue(new Error('Database error'));

      const handler = updateSmoothie(prisma);
      await handler(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to update smoothie' });
    });

    it('should handle update errors when deleting tags fails', async () => {
      req.params = { id: '1' };
      req.body = updateData;
      
      (prisma.smoothieIngredient.deleteMany as jest.Mock).mockResolvedValue({});
      (prisma.smoothieTag.deleteMany as jest.Mock).mockRejectedValue(new Error('Database error'));

      const handler = updateSmoothie(prisma);
      await handler(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to update smoothie' });
    });

    it('should handle update errors when updating smoothie fails', async () => {
      req.params = { id: '1' };
      req.body = updateData;
      
      (prisma.smoothieIngredient.deleteMany as jest.Mock).mockResolvedValue({});
      (prisma.smoothieTag.deleteMany as jest.Mock).mockResolvedValue({});
      (prisma.smoothie.update as jest.Mock).mockRejectedValue(new Error('Database error'));

      const handler = updateSmoothie(prisma);
      await handler(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to update smoothie' });
    });
  });

  describe('deleteSmoothie', () => {
    it('should delete a smoothie successfully', async () => {
      req.params = { id: '1' };
      (prisma.smoothie.delete as jest.Mock).mockResolvedValue({});

      const handler = deleteSmoothie(prisma);
      await handler(req as Request, res as Response);

      expect(prisma.smoothie.delete).toHaveBeenCalledWith({
        where: { id: '1' }
      });
      expect(res.json).toHaveBeenCalledWith({ message: 'Smoothie deleted' });
    });

    it('should handle deletion errors', async () => {
      req.params = { id: '1' };
      (prisma.smoothie.delete as jest.Mock).mockRejectedValue(new Error('Database error'));

      const handler = deleteSmoothie(prisma);
      await handler(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to delete smoothie' });
    });
  });




});

