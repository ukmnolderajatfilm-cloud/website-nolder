/*
  Warnings:

  - You are about to drop the column `featured_image` on the `articles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `articles` DROP COLUMN `featured_image`,
    ADD COLUMN `banner_image` VARCHAR(191) NULL;
