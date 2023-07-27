-- AlterTable
ALTER TABLE `location` ADD COLUMN `itineraireId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `status` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `Itineraire` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted_at` DATETIME(3) NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Location` ADD CONSTRAINT `Location_itineraireId_fkey` FOREIGN KEY (`itineraireId`) REFERENCES `Itineraire`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
