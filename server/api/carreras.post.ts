import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    try {
        const { nombre } = await readBody(event);
        if (!nombre || nombre.trim() === '') {
            throw createError({ statusCode: 400, statusMessage: 'El nombre es requerido.' });
        }
        const nuevaCarrera = await prisma.carrera.create({ data: { nombre: nombre.trim() } });
        return { statusCode: 201, message: 'Carrera agregada', carrera: nuevaCarrera };
    } catch (error: any) {
        if (error.code === 'P2002') {
            throw createError({ statusCode: 409, statusMessage: 'La carreras ya existe.' });
        }
        throw createError({ statusCode: 500, statusMessage: 'Error al agregar la carreras.' });
    }
});