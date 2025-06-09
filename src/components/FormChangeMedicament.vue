<script setup>
defineProps(["medicament", "id"]);
import { ref } from 'vue';
import Medicament from '../Class/Medicament.js';
const photo = ref(null);
const medicamentUpdate = ref({
  id: 740,
  denomination: '',
  formepharmaceutique: '',
  qte: 0,
});


const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    photo.value = reader.result
  };
  reader.readAsDataURL(file);
};

//On affiche les infos du médicament sélectionné dans le select dans le formulaire
function showMedicament() {

  const options = document.querySelectorAll('option');
  options.forEach(option => {
    if (option.selected) {
      const idPharmacie = 3;
      
      const url = `https://apipharmacie.pecatte.fr/api/${idPharmacie}/medicaments/${option.value}`;
      const myHeaders = new Headers()
      myHeaders.append("Content-Type", "application/json")
      const fetchOptions = {
        method: "GET",
        headers: myHeaders,
      }

      fetch(url, fetchOptions)
        .then(response => response.json())
        .then(dataJson => {
          let m = new Medicament(dataJson.id, dataJson.denomination, dataJson.formepharmaceutique, dataJson.photo, dataJson.qte)
          medicamentUpdate.value = m
        })
        .catch(error => {
          console.error("Erreur de chargement :", error)
        })
    }
  })
}

</script>

<template>
  <main class="container my-4">
    <form @submit.prevent="$emit('maj', medicamentUpdate, photo)" class="card p-4 shadow-sm">
      <h2 class="text-warning text-center mb-4">Modification d'un médicament</h2>
      <p>Choisissez le médicament à modifier :</p>
      <div class="mb-3">
        <label class="form-label">Choisissez le médicament à modifier</label>
        <select v-model="medicament.id" class="form-select" @click="showMedicament">
          <option disabled value="">-- Sélectionner un médicament --</option>
          <option required v-for="med in medicament" :key="med.id" :value="med.id">
            {{ med.denomination }}
          </option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">Nom du médicament</label>
        <input type="text" required v-model="medicamentUpdate.denomination" class="form-control" placeholder="Nom" />
      </div>

      <div class="mb-3">
        <label class="form-label">Forme pharmaceutique</label>
        <input type="text" required v-model="medicamentUpdate.formepharmaceutique" class="form-control"
          placeholder="Comprimé, sirop..." />
      </div>

      <div class="mb-3">
        <label class="form-label">Quantité</label>
        <input type="number" required v-model="medicamentUpdate.qte" class="form-control" placeholder="Quantité"
          min="0" />
      </div>

      <div class="mb-3">
        <label class="form-label">Photo</label>
        <input id="photo" required type="file" class="form-control" @change="handleFileUpload" />
      </div>

      <div class="text-center">
        <button type="submit" class="btn btn-warning">
          Valider la modification
        </button>
      </div>
    </form>
  </main>
</template>

<style scoped></style>