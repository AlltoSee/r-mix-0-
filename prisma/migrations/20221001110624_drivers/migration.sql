-- CreateTable
CREATE TABLE `drivers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` VARCHAR(191) NULL,
    `latitude` VARCHAR(191) NULL,
    `longityde` VARCHAR(191) NULL,
    `chat_id` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `rating` VARCHAR(191) NOT NULL DEFAULT '5.0',
    `name` VARCHAR(191) NULL,
    `balance` VARCHAR(191) NOT NULL DEFAULT '0',
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `drivers_chat_id_key`(`chat_id`),
    UNIQUE INDEX `drivers_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
