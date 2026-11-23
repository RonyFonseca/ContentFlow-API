-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "ideaId" TEXT,
ALTER COLUMN "postId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Image_ideaId_idx" ON "Image"("ideaId");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "Idea"("id") ON DELETE CASCADE ON UPDATE CASCADE;
