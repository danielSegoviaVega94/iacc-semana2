import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const clienteId = event.context.params?.id;

    if (!clienteId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'ID del cliente no proporcionado',
        });
    }

    try {
        await prisma.cliente.delete({
            where: {
                id: Number(clienteId),
            },
        });

        return {
            statusCode: 200,
            message: 'Cliente eliminado correctamente',
        };

    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: 'No se pudo eliminar al cliente',
        });
    }
});