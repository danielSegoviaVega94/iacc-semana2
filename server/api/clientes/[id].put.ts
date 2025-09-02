import { PrismaClient, EstadoCaso } from '@prisma/client';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    try {
        const clienteId = event.context.params?.id;
        const body = await readBody(event);

        if (!clienteId) {
            throw createError({ statusCode: 400, statusMessage: 'ID del cliente no proporcionado' });
        }

        const updatedCliente = await prisma.cliente.update({
            where: { id: Number(clienteId) },
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
            statusCode: 200,
            message: 'Cliente actualizado con éxito',
            cliente: updatedCliente,
        };

    } catch (error: any) {
        throw createError({ statusCode: 500, statusMessage: 'Error al actualizar el cliente.' });
    }
});