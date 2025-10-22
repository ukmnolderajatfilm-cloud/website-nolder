/*
  Warnings:

  - You are about to drop the column `excerpt` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the column `film_genre` on the `films` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `films` table. All the data in the column will be lost.
  - You are about to drop the column `release_date` on the `films` table. All the data in the column will be lost.
  - Added the required column `author` to the `articles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `release_year` to the `films` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `articles` DROP COLUMN `excerpt`,
    ADD COLUMN `author` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `films` DROP COLUMN `film_genre`,
    DROP COLUMN `rating`,
    DROP COLUMN `release_date`,
    ADD COLUMN `release_year` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `genres` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `judul_genre` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `genres_judul_genre_key`(`judul_genre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `film_genres` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `film_id` INTEGER NOT NULL,
    `genre_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `film_genres_film_id_genre_id_key`(`film_id`, `genre_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `film_genres` ADD CONSTRAINT `film_genres_film_id_fkey` FOREIGN KEY (`film_id`) REFERENCES `films`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `film_genres` ADD CONSTRAINT `film_genres_genre_id_fkey` FOREIGN KEY (`genre_id`) REFERENCES `genres`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
