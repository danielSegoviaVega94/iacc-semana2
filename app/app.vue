<template>
  <div class="container">
    <div class="form-container">
      <h1>Gestión de Clientes - Justicia para Todos</h1>
      <form @submit.prevent="guardarCliente">

        <div class="grid-2-cols">
          <div class="form-group">
            <label for="nombre">Nombre:</label>
            <input type="text" v-model="form.nombre" required>
          </div>
          <div class="form-group">
            <label for="apellido">Apellido:</label>
            <input type="text" v-model="form.apellido" required>
          </div>
        </div>

        <div class="grid-2-cols">
          <div class="form-group">
            <label for="rut">RUT:</label>
            <input type="text" v-model="form.rut" placeholder="12345678-9" required>
          </div>
          <div class="form-group">
            <label for="telefono">Teléfono:</label>
            <input type="text" v-model="form.telefono" placeholder="+56912345678" required>
          </div>
        </div>

        <div class="form-group">
          <label for="correo">Correo Electrónico:</label>
          <input type="email" v-model="form.correoElectronico" placeholder="usuario@dominio.com" required>
        </div>

        <div class="form-group">
          <label for="direccion">Dirección:</label>
          <input type="text" v-model="form.direccion" placeholder="País, N°, Calle, Depto, C.P." required>
        </div>

        <hr>

        <div class="grid-2-cols">
          <div class="form-group">
            <label for="numeroCaso">Número de Caso:</label>
            <input type="number" v-model="form.numeroCaso" required>
          </div>
          <div class="form-group">
            <label for="fechaInicioCaso">Fecha Inicio del Caso:</label>
            <input type="date" v-model="form.fechaInicioCaso" required>
          </div>
        </div>

        <div class="form-group">
          <label for="descripcionCaso">Descripción del Caso:</label>
          <textarea v-model="form.descripcionCaso" rows="3" required></textarea>
        </div>

        <div class="form-group">
          <label for="estadoCaso">Estado del Caso:</label>
          <select v-model="form.estadoCaso" required>
            <option value="ACTIVO">Activo</option>
            <option value="EN_PROCESO">En Proceso</option>
            <option value="CERRADO">Cerrado</option>
          </select>
        </div>

        <template v-if="form.estadoCaso === 'CERRADO'">
          <div class="form-group">
            <label for="descripcionSentencia">Descripción de Sentencia:</label>
            <textarea v-model="form.descripcionSentencia" rows="3"></textarea>
          </div>
          <div class="form-group">
            <label for="fechaCierreCaso">Fecha Cierre del Caso:</label>
            <input type="date" v-model="form.fechaCierreCaso">
          </div>
        </template>

        <div class="form-actions">
          <button type="submit" class="submit-btn">{{ modoEdicion ? 'Actualizar Cliente' : 'Registrar Cliente' }}</button>
          <button v-if="modoEdicion" @click="cancelarEdicion" type="button" class="cancel-btn">Cancelar</button>
        </div>

        <p v-if="mensaje" :class="esError ? 'mensaje-error' : 'mensaje-exito'">{{ mensaje }}</p>
      </form>
    </div>

    <div class="list-container">
      <h1>Clientes Registrados</h1>
      <p v-if="!clientes || clientes.length === 0">No hay clientes registrados.</p>
      <ul v-else>
        <li v-for="cliente in clientes" :key="cliente.id">
          <div class="client-info">
            <strong>{{ cliente.nombre }} {{ cliente.apellido }} (RUT: {{ cliente.rut }})</strong>
            <span>Caso #{{ cliente.numeroCaso }} - <span :class="`status-${cliente.estadoCaso}`">{{ cliente.estadoCaso }}</span></span>
            <span>📧 {{ cliente.correoElectronico }} | 📞 {{ cliente.telefono }}</span>
          </div>
          <div class="client-actions">
            <button @click="editarCliente(cliente)" class="edit-btn" title="Editar cliente">✏️</button>
            <button @click="eliminarCliente(cliente.id)" class="delete-btn" title="Eliminar cliente">×</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const modoEdicion = ref(false);
const clienteEditId = ref(null);

const form = ref({
  rut: '',
  nombre: '',
  apellido: '',
  direccion: '',
  correoElectronico: '',
  telefono: '',
  numeroCaso: '',
  descripcionCaso: '',
  fechaInicioCaso: '',
  estadoCaso: 'ACTIVO',
  descripcionSentencia: '',
  fechaCierreCaso: '',
});

const mensaje = ref('');
const esError = ref(false);

const { data: clientes, refresh: refrescarClientes } = await useFetch('/api/clientes');

const formatDateForInput = (date) => {
  if (!date) return '';
  return new Date(date).toISOString().split('T')[0];
};

const resetForm = () => {
  Object.keys(form.value).forEach(key => form.value[key] = '');
  form.value.estadoCaso = 'ACTIVO';
  modoEdicion.value = false;
  clienteEditId.value = null;
};

const guardarCliente = async () => {
  mensaje.value = '';
  esError.value = false;
  const url = modoEdicion.value ? `/api/clientes/${clienteEditId.value}` : '/api/clientes';
  const method = modoEdicion.value ? 'PUT' : 'POST';

  try {
    const response = await $fetch(url, {
      method: method,
      body: form.value,
    });
    mensaje.value = response.message;
    resetForm();
    await refrescarClientes();
  } catch (error) {
    esError.value = true;
    mensaje.value = error.data?.statusMessage || 'Ocurrió un error inesperado.';
  }
};

const editarCliente = (cliente) => {
  modoEdicion.value = true;
  clienteEditId.value = cliente.id;
  form.value = {
    ...cliente,
    fechaInicioCaso: formatDateForInput(cliente.fechaInicioCaso),
    fechaCierreCaso: formatDateForInput(cliente.fechaCierreCaso),
  };
  window.scrollTo(0, 0);
};

const cancelarEdicion = () => {
  resetForm();
};

const eliminarCliente = async (id) => {
  if (confirm('¿Estás seguro de que quieres eliminar a este cliente?')) {
    try {
      await $fetch(`/api/clientes/${id}`, { method: 'DELETE' });
      await refrescarClientes();
      if(id === clienteEditId.value) {
        resetForm();
      }
    } catch (error) {
      alert('Error al eliminar el cliente.');
    }
  }
};
</script>

<style>
body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f4f7f6; margin: 0; padding: 20px; }
.container { display: flex; flex-direction: column; align-items: center; gap: 40px; }
.form-container, .list-container { background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); width: 100%; max-width: 700px; box-sizing: border-box; }
h1 { text-align: center; color: #333; margin-top: 0; margin-bottom: 25px; }
.form-group { margin-bottom: 20px; }
label { display: block; margin-bottom: 8px; font-weight: bold; color: #555; }
input[type="text"], input[type="date"], input[type="email"], input[type="number"], select, textarea { width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 5px; box-sizing: border-box; font-size: 16px; }
hr { border: 0; height: 1px; background: #ddd; margin: 30px 0; }
.grid-2-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.form-actions { display: flex; gap: 10px; }
.submit-btn, .cancel-btn { flex-grow: 1; color: white; padding: 15px; border: none; border-radius: 5px; font-size: 18px; cursor: pointer; transition: background-color 0.3s ease; }
.submit-btn { background-color: #0056b3; }
.submit-btn:hover { background-color: #004494; }
.cancel-btn { background-color: #6c757d; }
.cancel-btn:hover { background-color: #5a6268; }
.list-container ul { list-style: none; padding: 0; }
.list-container li { display: flex; justify-content: space-between; align-items: center; background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 10px; border-left: 4px solid #0056b3; }
.client-info strong { display: block; font-size: 1.1em; color: #004494; }
.client-info span { color: #555; font-size: 0.9em; display: block; }
.client-actions { display: flex; gap: 8px; }
.edit-btn, .delete-btn { color: white; border: none; width: 35px; height: 35px; border-radius: 50%; cursor: pointer; font-size: 18px; line-height: 35px; text-align: center; transition: background-color 0.3s ease; }
.edit-btn { background-color: #ffc107; }
.edit-btn:hover { background-color: #e0a800; }
.delete-btn { background-color: #dc3545; }
.delete-btn:hover { background-color: #c82333; }
.mensaje-exito { color: #28a745; text-align: center; margin-top: 15px; font-weight: bold; }
.mensaje-error { color: #dc3545; text-align: center; margin-top: 15px; font-weight: bold; }
.status-ACTIVO { color: #28a745; font-weight: bold; }
.status-EN_PROCESO { color: #ffc107; font-weight: bold; }
.status-CERRADO { color: #6c757d; font-weight: bold; }
</style>