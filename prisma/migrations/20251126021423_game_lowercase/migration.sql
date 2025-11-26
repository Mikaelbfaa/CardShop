/*
  Warnings:

  - The values [MTG,YUGIOH] on the enum `Game` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Game_new" AS ENUM ('mtg', 'yugioh');
ALTER TABLE "products" ALTER COLUMN "game" TYPE "Game_new" USING ("game"::text::"Game_new");
ALTER TYPE "Game" RENAME TO "Game_old";
ALTER TYPE "Game_new" RENAME TO "Game";
DROP TYPE "public"."Game_old";
COMMIT;
