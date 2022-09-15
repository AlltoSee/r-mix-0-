-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `chat_id` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `rating` VARCHAR(191) NOT NULL DEFAULT '5.0',
    `name` VARCHAR(191) NULL,
    `first_name` VARCHAR(191) NULL,
    `last_name` VARCHAR(191) NULL,
    `balance` VARCHAR(191) NOT NULL DEFAULT '0',
    `cashback` VARCHAR(191) NOT NULL DEFAULT '0',
    `referrer` VARCHAR(191) NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'user',
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `user_chat_id_key`(`chat_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` VARCHAR(191) NOT NULL,
    `view` VARCHAR(191) NOT NULL,
    `basket` JSON NULL,
    `from` JSON NULL,
    `to` JSON NULL,
    `order_price` VARCHAR(191) NOT NULL,
    `expectation` VARCHAR(191) NOT NULL DEFAULT '0',
    `price` VARCHAR(191) NOT NULL,
    `driver` JSON NULL,
    `comment` VARCHAR(191) NULL,
    `user` JSON NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `img` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `price` VARCHAR(191) NOT NULL,
    `options` JSON NULL,
    `descriptions` VARCHAR(191) NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_options` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `descriptions` VARCHAR(191) NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reviews` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `grade` VARCHAR(191) NOT NULL,
    `author` JSON NOT NULL,
    `user` JSON NOT NULL,
    `review` VARCHAR(191) NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `city` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `latitude` VARCHAR(191) NULL,
    `longityde` VARCHAR(191) NULL,
    `region` VARCHAR(191) NULL,
    `sub_region` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `places` VARCHAR(191) NULL,
    `price` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `variables` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `variabl` VARCHAR(191) NOT NULL,
    `meaning` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `variables_variabl_key`(`variabl`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
