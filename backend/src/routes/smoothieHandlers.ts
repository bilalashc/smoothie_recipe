import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

export const getAllSmoothies = (prisma: PrismaClient) => async (req: Request, res: Response) => {
  try {
    const smoothies = await prisma.smoothie.findMany({
      include: {
        ingredients: { include: { ingredient: true } },
        tags: { include: { tag: true } },
      },
    });
    res.json(smoothies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch smoothies' });
  }
};

export const getSmoothieById = (prisma: PrismaClient) => async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const smoothie = await prisma.smoothie.findUnique({
      where: { id },
      include: {
        ingredients: { include: { ingredient: true } },
        tags: { include: { tag: true } },
      },
    });

    if (smoothie) {
      res.json(smoothie);
    } else {
      res.status(404).json({ error: 'Smoothie not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch individual smoothie' });
  }
};

export const createSmoothie = (prisma: PrismaClient) => async (req: Request, res: Response) => {
  const { name, ingredients, tags } = req.body;
  try {
    const smoothie = await prisma.smoothie.create({
      data: {
        name,
        ingredients: {
          create: ingredients.map((ingredient: any) => ({
            quantity: ingredient.quantity,
            unit: ingredient.unit,
            ingredient: {
              connectOrCreate: {
                where: { name: ingredient.name },
                create: { name: ingredient.name },
              },
            },
          })),
        },
        tags: {
          create: tags?.map((tagName: string) => ({
            tag: {
              connectOrCreate: {
                where: { name: tagName },
                create: { name: tagName },
              },
            },
          })),
        },
      },
      include: {
        ingredients: { include: { ingredient: true } },
        tags: true,
      },
    });

    res.status(201).json(smoothie);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create smoothie' });
  }
};

export const updateSmoothie = (prisma: PrismaClient) => async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, ingredients, tags } = req.body;

  try {
    await prisma.smoothieIngredient.deleteMany({
      where: { smoothieId: id },
    });

    await prisma.smoothieTag.deleteMany({
      where: { smoothieId: id },
    });

    const smoothie = await prisma.smoothie.update({
      where: { id },
      data: {
        name,
        ingredients: {
          create: ingredients.map((ingredient: any) => ({
            quantity: ingredient.quantity,
            unit: ingredient.unit,
            ingredient: {
              connectOrCreate: {
                where: { name: ingredient.name },
                create: { name: ingredient.name },
              },
            },
          })),
        },
        tags: {
          create: tags?.map((tagName: string) => ({
            tag: {
              connectOrCreate: {
                where: { name: tagName },
                create: { name: tagName },
              },
            },
          })),
        },
      },
      include: {
        ingredients: { include: { ingredient: true } },
        tags: true,
      },
    });
    res.status(200).json(smoothie);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update smoothie' });
  }
};

export const deleteSmoothie = (prisma: PrismaClient) => async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.smoothie.delete({
      where: { id },
    });
    res.json({ message: 'Smoothie deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete smoothie' });
  }
};