import { PrismaClient, EstadoCaso } from '@prisma/client';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);

        if (!body.rut || !body.nombre || !body.apellido || !body.correoElectronico || !body.numeroCaso) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Faltan datos requeridos para el registro.',
            });
        }

        const nuevoCliente = await prisma.cliente.create({
            data: {
                rut: body.rut,
                nombre: body.nombre,
                apellido: body.apellido,
                direccion: body.direccion,
                correoElectronico: body.correoElectronico,
                telefono: body.telefono,
                numeroCaso: Number(body.numeroCaso),
                descripcionCaso: body.descripcionCaso,
                fechaInicioCaso: new Date(body.fechaInicioCaso),
                estadoCaso: body.estadoCaso as EstadoCaso,
                descripcionSentencia: body.descripcionSentencia,
                fechaCierreCaso: body.fechaCierreCaso ? new Date(body.fechaCierreCaso) : null,
            },
        });

        return {
            statusCode: 201,
            message: 'Cliente registrado con éxito',
            cliente: nuevoCliente,
        };

    } catch (error: any) {
        if (error.code === 'P2002') {
            throw createError({
                statusCode: 409,
                statusMessage: `El campo ${error.meta.target.join(', ')} ya existe.`,
            });
        }
        throw createError({
            statusCode: 500,
            statusMessage: 'Error interno del servidor al registrar el cliente.',
        });
    }
});