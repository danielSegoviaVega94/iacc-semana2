import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default defineEventHandler(async () => {
    return prisma.estudiante.findMany({
        include: {
            carrera: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
});