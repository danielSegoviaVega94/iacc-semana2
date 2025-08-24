import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);

        if (!body.nombre || !body.rut || !body.carreraId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Faltan datos requeridos.',
            });
        }

        const nuevoEstudiante = await prisma.estudiante.create({
            data: {
                nombre: body.nombre,
                apellido: body.apellido,
                rut: body.rut,
                direccion: body.direccion,
                fechaPeriodo: new Date(body.fechaPeriodo),
                carreraId: Number(body.carreraId),
            },
        });

        return {
            statusCode: 201, // 201 Creado
            message: 'Estudiante registrado con éxito',
            estudiante: nuevoEstudiante,
        };

    } catch (error: any) {
        if (error.code === 'P2002') {
            throw createError({
                statusCode: 409,
                statusMessage: 'El RUT ingresado ya existe.',
            });
        }

        return error;
    }
});