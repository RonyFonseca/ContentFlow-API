/*
  Warnings:

  - You are about to drop the column `legenda` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `titulo` on the `Post` table. All the data in the column will be lost.
  - Added the required column `content` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "legenda",
DROP COLUMN "titulo",
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;
