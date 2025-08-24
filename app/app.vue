<template>
  <div class="container">
    <div class="career-manager-container">
      <h1>🛠️ Administrar Carreras</h1>
      <form @submit.prevent="agregarCarrera" class="career-form">
        <div class="form-group">
          <label for="new-career">Nombre de la Carrera:</label>
          <input id="new-career" type="text" v-model="nuevaCarreraNombre" placeholder="Ej: Ingeniería Civil" required>
        </div>
        <button type="submit" class="submit-btn-small">Agregar Carrera</button>
      </form>
      <div class="career-list">
        <h3>Carreras Actuales</h3>
        <p v-if="!carreras || carreras.length === 0">No hay carreras registradas.</p>
        <ul v-else>
          <li v-for="carrera in carreras" :key="carrera.id">
            <span>{{ carrera.nombre }}</span>
            <button @click="eliminarCarrera(carrera.id)" class="delete-btn-small" title="Eliminar carrera">×</button>
          </li>
        </ul>
      </div>
    </div>

    <div class="form-container">
      <h1>📝 Registro Estudiantil</h1>
      <form @submit.prevent="registrarEstudiante">

        <div class="form-group">
          <label for="nombre">Nombre:</label>
          <input type="text" v-model="form.nombre" required>
        </div>

        <div class="form-group">
          <label for="apellido">Apellido:</label>
          <input type="text" v-model="form.apellido" required>
        </div>

        <div class="form-group">
          <label for="rut">RUT:</label>
          <input type="text" v-model="form.rut" placeholder="Ej: 12.345.678-9" required>
        </div>

        <div class="form-group">
          <label for="direccion">Dirección:</label>
          <input type="text" v-model="form.direccion" required>
        </div>

        <div class="form-group">
          <label for="carrera">Carrera a Cursar:</label>
          <select v-model="form.carreraId" required>
            <option disabled value="">-- Seleccione una carrera --</option>
            <option v-for="carrera in carreras" :key="carrera.id" :value="carrera.id">
              {{ carrera.nombre }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="periodo">Fecha de Período Académico:</label>
          <input type="date" v-model="form.fechaPeriodo" required>
        </div>

        <button type="submit" class="submit-btn">Registrar Estudiante</button>

        <p v-if="mensaje" :class="esError ? 'mensaje-error' : 'mensaje-exito'">{{ mensaje }}</p>
      </form>
    </div>

    <div class="list-container">
      <h1>🎓 Estudiantes Registrados</h1>
      <p v-if="!estudiantes || estudiantes.length === 0">No hay estudiantes registrados aún.</p>
      <ul v-else>
        <li v-for="estudiante in estudiantes" :key="estudiante.id">
          <div class="student-info">
            <strong>{{ estudiante.nombre }} {{ estudiante.apellido }}</strong> ({{ estudiante.rut }})
            <span>Carrera: {{ estudiante.carrera.nombre }}</span>
          </div>
          <button @click="eliminarEstudiante(estudiante.id)" class="delete-btn" title="Eliminar estudiante">×</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const nuevaCarreraNombre = ref('');

const form = ref({
  nombre: '',
  apellido: '',
  rut: '',
  direccion: '',
  carreraId: '',
  fechaPeriodo: '',
});
const mensaje = ref('');
const esError = ref(false);

// --- Carga de Datos desde la API ---
const { data: carreras, refresh: refrescarCarreras } = await useFetch('/api/carreras');
const { data: estudiantes, refresh: refrescarEstudiantes } = await useFetch('/api/estudiantes');

// --- Lógica para Administrar Carreras ---
const agregarCarrera = async () => {
  if (!nuevaCarreraNombre.value.trim()) return;
  try {
    await $fetch('/api/carreras', {
      method: 'POST',
      body: { nombre: nuevaCarreraNombre.value },
    });
    nuevaCarreraNombre.value = '';
    await refrescarCarreras();
  } catch (error) {
    alert(error.data?.statusMessage || 'Error al agregar carrera.');
  }
};

const eliminarCarrera = async (id) => {
  if (confirm('¿Seguro que quieres eliminar esta carrera?')) {
    try {
      await $fetch(`/api/carreras/${id}`, { method: 'DELETE' });
      await refrescarCarreras();
      await refrescarEstudiantes(); // Refrescar por si se eliminó un estudiante indirectamente
    } catch (error) {
      alert(error.data?.statusMessage || 'Error al eliminar carrera.');
    }
  }
};

const registrarEstudiante = async () => {
  mensaje.value = '';
  esError.value = false;
  try {
    const response = await $fetch('/api/registro', {
      method: 'POST',
      body: form.value,
    });
    mensaje.value = response.message;
    Object.keys(form.value).forEach(key => form.value[key] = '');
    await refrescarEstudiantes();
  } catch (error) {
    esError.value = true;
    mensaje.value = error.data?.statusMessage || 'Ocurrió un error inesperado al registrar.';
  }
};

const eliminarEstudiante = async (id) => {
  if (confirm('¿Estás seguro de que quieres eliminar a este estudiante?')) {
    try {
      await $fetch(`/api/estudiantes/${id}`, { method: 'DELETE' });
      await refrescarEstudiantes();
    } catch (error) {
      alert('Error al eliminar el estudiante.');
    }
  }
};
</script>

<style>
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background-color: #f4f7f6;
  margin: 0;
  padding: 20px;
}
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
}

.form-container, .list-container, .career-manager-container {
  background-color: #ffffff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  box-sizing: border-box;
}

h1 {
  text-align: center;
  color: #0056b3;
  margin-top: 0;
  margin-bottom: 25px;
}
.form-group { margin-bottom: 20px; }
label { display: block; margin-bottom: 8px; font-weight: bold; color: #333; }
input[type="text"], input[type="date"], select {
  width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 5px; box-sizing: border-box; font-size: 16px;
}
.submit-btn {
  width: 100%; background-color: #0056b3; color: white; padding: 15px; border: none; border-radius: 5px; font-size: 18px; cursor: pointer; transition: background-color 0.3s ease;
}
.submit-btn:hover { background-color: #004494; }

.list-container ul { list-style: none; padding: 0; }
.list-container li { display: flex; justify-content: space-between; align-items: center; background-color: #e9f5ff; padding: 15px; border-radius: 5px; margin-bottom: 10px; border-left: 4px solid #0056b3; }
.student-info strong { display: block; font-size: 1.1em; color: #004494; }
.student-info span { color: #555; font-size: 0.9em; }

.mensaje-exito { color: #28a745; text-align: center; margin-top: 15px; font-weight: bold; }
.mensaje-error { color: #dc3545; text-align: center; margin-top: 15px; font-weight: bold; }

.delete-btn { background-color: #dc3545; color: white; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; font-size: 20px; line-height: 30px; text-align: center; transition: background-color 0.3s ease; }
.delete-btn:hover { background-color: #c82333; }

.career-manager-container h3 { color: #0056b3; border-bottom: 2px solid #eee; padding-bottom: 10px; }
.career-form { display: flex; align-items: flex-end; gap: 10px; margin-bottom: 20px; }
.career-form .form-group { flex-grow: 1; margin-bottom: 0; }
.submit-btn-small { background-color: #28a745; color: white; padding: 12px 20px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; transition: background-color 0.3s ease; }
.submit-btn-small:hover { background-color: #218838; }
.career-list ul { list-style: none; padding: 0; }
.career-list li { display: flex; justify-content: space-between; align-items: center; padding: 10px; border-radius: 5px; margin-bottom: 8px; background-color: #f8f9fa; }
.delete-btn-small { background-color: #e74c3c; color: white; border: none; width: 24px; height: 24px; border-radius: 50%; cursor: pointer; font-size: 16px; line-height: 24px; text-align: center; transition: background-color 0.3s ease; }
.delete-btn-small:hover { background-color: #c0392b; }
</style>
