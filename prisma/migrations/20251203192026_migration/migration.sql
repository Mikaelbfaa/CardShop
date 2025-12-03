/*
  Warnings:

  - You are about to drop the column `categoryId` on the `products` table. All the data in the column will be lost.
  - You are about to drop the `categories` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "CardType" AS ENUM ('MONSTER', 'SPELL', 'TRAP', 'CREATURE', 'INSTANT', 'SORCERY', 'ENCHANTMENT', 'ARTIFACT', 'LAND', 'PLANESWALKER');

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_categoryId_fkey";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "categoryId",
ADD COLUMN     "cardType" "CardType";

-- DropTable
DROP TABLE "categories";
