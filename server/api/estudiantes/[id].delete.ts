import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const studentId = event.context.params?.id;

    if (!studentId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'ID del estudiante no proporcionado',
        });
    }

    try {
        await prisma.estudiante.delete({
            where: {
                id: Number(studentId),
            },
        });

        return {
            statusCode: 200,
            message: 'Estudiante eliminado correctamente',
        };

    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: 'No se pudo eliminar al estudiante',
        });
    }
});