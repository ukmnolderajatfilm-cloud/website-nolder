-- Create genres table
CREATE TABLE `genres` (
  `id` int NOT NULL AUTO_INCREMENT,
  `judul_genre` varchar(255) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `genres_judul_genre_key` (`judul_genre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create film_genres junction table
CREATE TABLE `film_genres` (
  `id` int NOT NULL AUTO_INCREMENT,
  `film_id` int NOT NULL,
  `genre_id` int NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `film_genres_film_id_genre_id_key` (`film_id`, `genre_id`),
  KEY `film_genres_film_id_fkey` (`film_id`),
  KEY `film_genres_genre_id_fkey` (`genre_id`),
  CONSTRAINT `film_genres_film_id_fkey` FOREIGN KEY (`film_id`) REFERENCES `films` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `film_genres_genre_id_fkey` FOREIGN KEY (`genre_id`) REFERENCES `genres` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Migrate existing genres from films.film_genre to new system
-- First, extract unique genres from films table
INSERT INTO `genres` (`judul_genre`, `created_at`, `updated_at`)
SELECT DISTINCT 
  TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(film_genre, ',', numbers.n), ',', -1)) as genre_name,
  NOW() as created_at,
  NOW() as updated_at
FROM films
CROSS JOIN (
  SELECT 1 n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5
  UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10
) numbers
WHERE CHAR_LENGTH(film_genre) - CHAR_LENGTH(REPLACE(film_genre, ',', '')) >= numbers.n - 1
  AND TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(film_genre, ',', numbers.n), ',', -1)) != ''
  AND TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(film_genre, ',', numbers.n), ',', -1)) IS NOT NULL;

-- Create film-genre relationships
INSERT INTO `film_genres` (`film_id`, `genre_id`, `created_at`)
SELECT 
  f.id as film_id,
  g.id as genre_id,
  NOW() as created_at
FROM films f
CROSS JOIN (
  SELECT 1 n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5
  UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10
) numbers
JOIN genres g ON g.judul_genre = TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(f.film_genre, ',', numbers.n), ',', -1))
WHERE CHAR_LENGTH(f.film_genre) - CHAR_LENGTH(REPLACE(f.film_genre, ',', '')) >= numbers.n - 1
  AND TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(f.film_genre, ',', numbers.n), ',', -1)) != ''
  AND TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(f.film_genre, ',', numbers.n), ',', -1)) IS NOT NULL;

-- Remove old film_genre column
ALTER TABLE `films` DROP COLUMN `film_genre`;
