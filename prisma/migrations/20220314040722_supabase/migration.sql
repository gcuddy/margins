/*
  Warnings:

  - You are about to drop the `Location` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Location" AS ENUM ('INBOX', 'UP_NEXT', 'LATER');

-- CreateEnum
CREATE TYPE "ListItemType" AS ENUM ('Article', 'Bookmark', 'Note');

-- AlterTable
ALTER TABLE "RssFeedItem" ADD COLUMN     "starred" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "bookmarkId" INTEGER;

-- DropTable
DROP TABLE "Location";

-- CreateTable
CREATE TABLE "Bookmark" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "html" TEXT NOT NULL,
    "articleId" INTEGER,
    "contextId" INTEGER NOT NULL,

    CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Context" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Context_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "List" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "List_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListItem" (
    "id" SERIAL NOT NULL,
    "listId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "ListItemType" NOT NULL,
    "articleId" INTEGER,
    "bookmarkId" INTEGER,
    "highlightId" TEXT,
    "annotationId" INTEGER,

    CONSTRAINT "ListItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_url_key" ON "Bookmark"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_articleId_key" ON "Bookmark"("articleId");

-- CreateIndex
CREATE UNIQUE INDEX "Context_url_key" ON "Context"("url");

-- CreateIndex
CREATE UNIQUE INDEX "List_name_key" ON "List"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ListItem_listId_key" ON "ListItem"("listId");

-- CreateIndex
CREATE UNIQUE INDEX "ListItem_articleId_key" ON "ListItem"("articleId");

-- CreateIndex
CREATE UNIQUE INDEX "ListItem_bookmarkId_key" ON "ListItem"("bookmarkId");

-- CreateIndex
CREATE UNIQUE INDEX "ListItem_highlightId_key" ON "ListItem"("highlightId");

-- CreateIndex
CREATE UNIQUE INDEX "ListItem_annotationId_key" ON "ListItem"("annotationId");

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_contextId_fkey" FOREIGN KEY ("contextId") REFERENCES "Context"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListItem" ADD CONSTRAINT "ListItem_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListItem" ADD CONSTRAINT "ListItem_bookmarkId_fkey" FOREIGN KEY ("bookmarkId") REFERENCES "Bookmark"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListItem" ADD CONSTRAINT "ListItem_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListItem" ADD CONSTRAINT "ListItem_highlightId_fkey" FOREIGN KEY ("highlightId") REFERENCES "Highlight"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListItem" ADD CONSTRAINT "ListItem_annotationId_fkey" FOREIGN KEY ("annotationId") REFERENCES "Annotation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_bookmarkId_fkey" FOREIGN KEY ("bookmarkId") REFERENCES "Bookmark"("id") ON DELETE SET NULL ON UPDATE CASCADE;
