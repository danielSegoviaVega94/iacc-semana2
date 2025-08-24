import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const carreraId = event.context.params?.id;
    if (!carreraId) {
        throw createError({ statusCode: 400, statusMessage: 'ID no proporcionado' });
    }
    try {
        await prisma.carrera.delete({ where: { id: Number(carreraId) } });
        return { statusCode: 200, message: 'Carrera eliminada' };
    } catch (error: any) {
        if (error.code === 'P2003') {
            throw createError({ statusCode: 409, statusMessage: 'No se puede eliminar, tiene estudiantes asociados.' });
        }
        throw createError({ statusCode: 500, statusMessage: 'Error al eliminar.' });
    }
});