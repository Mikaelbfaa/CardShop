/*
  Warnings:

  - The primary key for the `cart_items` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `cart_items` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "cart_items_cartId_productId_key";

-- AlterTable
ALTER TABLE "cart_items" DROP CONSTRAINT "cart_items_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "cart_items_pkey" PRIMARY KEY ("cartId", "productId");

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "badge" TEXT,
ADD COLUMN     "cardSubtypes" TEXT,
ADD COLUMN     "edition" TEXT,
ADD COLUMN     "fullImage" TEXT,
ADD COLUMN     "oldPrice" DECIMAL(10,2);
