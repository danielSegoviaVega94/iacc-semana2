-- CreateTable
CREATE TABLE `Cliente` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rut` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `apellido` VARCHAR(191) NOT NULL,
    `direccion` VARCHAR(191) NOT NULL,
    `correoElectronico` VARCHAR(191) NOT NULL,
    `telefono` VARCHAR(191) NOT NULL,
    `numeroCaso` INTEGER NOT NULL,
    `descripcionCaso` TEXT NOT NULL,
    `fechaInicioCaso` DATETIME(3) NOT NULL,
    `estadoCaso` ENUM('ACTIVO', 'EN_PROCESO', 'CERRADO') NOT NULL,
    `descripcionSentencia` TEXT NULL,
    `fechaCierreCaso` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Cliente_rut_key`(`rut`),
    UNIQUE INDEX `Cliente_correoElectronico_key`(`correoElectronico`),
    UNIQUE INDEX `Cliente_numeroCaso_key`(`numeroCaso`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
