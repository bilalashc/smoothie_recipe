/*
  Warnings:

  - Added the required column `unit` to the `SmoothieIngredient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SmoothieIngredient" ADD COLUMN     "unit" TEXT NOT NULL;
