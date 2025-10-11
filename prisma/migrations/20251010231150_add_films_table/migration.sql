-- CreateTable
CREATE TABLE `films` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `film_title` VARCHAR(191) NOT NULL,
    `film_genre` VARCHAR(191) NOT NULL,
    `rating` DECIMAL(2, 1) NOT NULL,
    `duration` INTEGER NOT NULL,
    `director` VARCHAR(191) NOT NULL,
    `release_date` DATE NOT NULL,
    `status` ENUM('coming_soon', 'now_showing', 'archived') NOT NULL DEFAULT 'coming_soon',
    `description` VARCHAR(191) NULL,
    `poster_url` VARCHAR(191) NULL,
    `trailer_url` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,
    `admin_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `films` ADD CONSTRAINT `films_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `admins`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
