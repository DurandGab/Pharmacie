<script setup>
import { ref, onMounted } from 'vue';
const denomination = ref("");
const formepharmaceutique = ref("");
const quantite = ref(0);
const photo = ref(null);

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    photo.value = reader.result
  };
  reader.readAsDataURL(file);
};

onMounted(() => {
  denomination.value = "";
  formepharmaceutique.value = "";
  quantite.value = 0;
  photo.value = null;
});



</script>

<template>
  <main class="container my-4">
    <form @submit.prevent="$emit('add', denomination, formepharmaceutique, quantite, photo)" class="card p-4 shadow-sm">
      <h2 class="mb-4 text-success text-center">Ajout d'un médicament</h2>

      <div class="mb-3">
        <label class="form-label">Nom du médicament</label>
        <input type="text" required v-model="denomination" class="form-control" placeholder="Nom du médicament" />
      </div>

      <div class="mb-3">
        <label class="form-label">Forme pharmaceutique</label>
        <input type="text" required v-model="formepharmaceutique" class="form-control"
          placeholder="Forme (comprimé, sirop...)" />
      </div>

      <div class="mb-3">
        <label class="form-label">Quantité</label>
        <input type="number" required v-model="quantite" class="form-control" placeholder="Quantité" min="1" />
      </div>

      <div class="mb-3">
        <label class="form-label">Photo</label>
        <input id="photo" required type="file" class="form-control" @change="handleFileUpload" />
      </div>

      <div class="text-center">
        <button type="submit" class="btn btn-success">Valider</button>
      </div>
    </form>
  </main>
</template>

<style scoped></style>
