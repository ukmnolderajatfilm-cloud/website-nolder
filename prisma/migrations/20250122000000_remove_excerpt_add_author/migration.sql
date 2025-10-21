-- AlterTable
ALTER TABLE `articles` ADD COLUMN `author` VARCHAR(191) NOT NULL DEFAULT 'Admin';

-- AlterTable
ALTER TABLE `articles` DROP COLUMN `excerpt`;
