import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default defineEventHandler(async () => {
    const count = await prisma.carrera.count();
    if (count === 0) {
        await prisma.carrera.createMany({
            data: [
                { nombre: 'Ingeniería en Software' },
                { nombre: 'Diseño Gráfico' },
                { nombre: 'Administración de Empresas' },
                { nombre: 'Psicología' },
            ],
        });
    }

    return prisma.carrera.findMany();
});